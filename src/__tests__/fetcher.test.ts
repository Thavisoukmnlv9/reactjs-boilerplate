import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/core/api/api-error'
import { fetcher } from '@/core/utils/fetcher'

/**
 * Characterization tests for the error-extraction logic reached through the
 * public `fetcher` API. Every non-2xx (non-401) response funnels through
 * `getErrorMessageAndCode` and surfaces as an `ApiError`, so asserting on the
 * thrown error's `message` / `code` pins the exact current behavior across
 * all branches (FastAPI `detail`, `{ error }`, `message`, body fallbacks,
 * and the status-code default map).
 */

type BodyKind = 'json' | 'text'

interface FakeResponseOptions {
  status: number
  statusText?: string
  contentType?: string | null
  /** Body value: object for json, string for text. */
  body?: unknown
  /** When true, reading the body (json/text) throws — simulates unreadable. */
  unreadable?: boolean
}

/**
 * Build a minimal object matching the parts of `Response` that fetcher touches:
 * `ok`, `status`, `statusText`, `headers.get`, and a `clone()` that yields an
 * object exposing `json()` / `text()`.
 */
function makeResponse(opts: FakeResponseOptions): Response {
  const {
    status,
    statusText = '',
    contentType = 'application/json',
    body,
    unreadable = false,
  } = opts

  const kind: BodyKind = typeof body === 'string' ? 'text' : 'json'

  const cloneTarget = {
    json: async () => {
      if (unreadable) throw new Error('cannot read body')
      if (kind === 'text') {
        // Text bodies aren't valid JSON — mirror a real parse failure.
        throw new SyntaxError('Unexpected token in JSON')
      }
      return body
    },
    text: async () => {
      if (unreadable) throw new Error('cannot read body')
      if (kind === 'text') return body as string
      return JSON.stringify(body)
    },
  }

  const res = {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === 'content-type' ? contentType : null,
    },
    clone: () => cloneTarget,
    // Direct reads (used by parseOkResponseBody on 2xx paths)
    text: cloneTarget.text,
    json: cloneTarget.json,
  }

  return res as unknown as Response
}

/** Run `fetcher.get` against a canned response and capture the thrown ApiError. */
async function errorFrom(opts: FakeResponseOptions): Promise<ApiError> {
  const fetchMock = vi.fn().mockResolvedValue(makeResponse(opts))
  vi.stubGlobal('fetch', fetchMock)
  try {
    await fetcher.get('/x')
    throw new Error('expected fetcher.get to throw')
  } catch (err) {
    if (!(err instanceof ApiError)) throw err
    return err
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetcher error extraction (characterization)', () => {
  describe('FastAPI `detail`', () => {
    it('string detail becomes the message', async () => {
      const err = await errorFrom({ status: 400, body: { detail: 'Bad thing' } })
      expect(err.message).toBe('Bad thing')
      expect(err.code).toBeUndefined()
    })

    it('whitespace-only string detail is ignored → falls back to body text', async () => {
      const err = await errorFrom({ status: 404, body: { detail: '   ' } })
      // Blank detail yields no message/code, so the JSON path returns nothing
      // and the fallback reads the (short, tag-free) body text verbatim.
      expect(err.message).toBe('{"detail":"   "}')
    })

    it('array of validation issues → field-scoped first issue', async () => {
      const err = await errorFrom({
        status: 422,
        body: { detail: [{ msg: 'field required', loc: ['body', 'name'] }] },
      })
      expect(err.message).toBe('Name: field required')
      expect(err.code).toBeUndefined()
    })

    it("Zod's 'received null' noise → a clean required-field message", async () => {
      const err = await errorFrom({
        status: 422,
        body: { detail: [{ msg: 'Invalid input: expected string, received null', loc: ['body', 'description'] }] },
      })
      expect(err.message).toBe('Description is required.')
    })

    it('a trailing _id is stripped from the field label', async () => {
      const err = await errorFrom({
        status: 422,
        body: { detail: [{ msg: 'Invalid input: expected string, received undefined', loc: ['body', 'role_id'] }] },
      })
      expect(err.message).toBe('Role is required.')
    })

    it('multiple issues → first shown with a "+N more" hint', async () => {
      const err = await errorFrom({
        status: 422,
        body: {
          detail: [
            { msg: 'Invalid input: expected string, received null', loc: ['body', 'name'] },
            { msg: 'Enter a valid email address', loc: ['body', 'email'] },
          ],
        },
      })
      expect(err.message).toBe('Name is required. (+1 more)')
    })

    it('a message that already names its field is left as-is', async () => {
      const err = await errorFrom({
        status: 422,
        body: { detail: [{ msg: 'Enter a valid email address', loc: ['body', 'email'] }] },
      })
      expect(err.message).toBe('Enter a valid email address')
    })

    it('array of plain strings → first string', async () => {
      const err = await errorFrom({
        status: 422,
        body: { detail: ['first problem', 'second problem'] },
      })
      expect(err.message).toBe('first problem')
    })

    it('empty array detail → no message resolved, falls back to body text', async () => {
      const err = await errorFrom({ status: 422, body: { detail: [] } })
      expect(err.message).toBe('{"detail":[]}')
    })

    it('array whose first item lacks msg → no message, falls back to body text', async () => {
      const err = await errorFrom({
        status: 422,
        body: { detail: [{ loc: ['body'] }] },
      })
      expect(err.message).toBe('{"detail":[{"loc":["body"]}]}')
    })
  })

  describe('`error` field', () => {
    it('object error with message + code', async () => {
      const err = await errorFrom({
        status: 403,
        body: { error: { message: 'Nope', code: 'FORBIDDEN_X' } },
      })
      expect(err.message).toBe('Nope')
      expect(err.code).toBe('FORBIDDEN_X')
    })

    it('object error with message but no code', async () => {
      const err = await errorFrom({
        status: 403,
        body: { error: { message: 'Nope' } },
      })
      expect(err.message).toBe('Nope')
      expect(err.code).toBeUndefined()
    })

    it('string error becomes the code; message falls back to default(status)', async () => {
      const err = await errorFrom({
        status: 409,
        body: { error: 'CONFLICT_CODE' },
      })
      expect(err.code).toBe('CONFLICT_CODE')
      // code present → the JSON branch returns { message: default(status), code };
      // 409 has no explicit case so the generic 4xx default applies.
      expect(err.message).toBe('Bad Request')
    })

    it('string error but detail also present → detail wins for message, error is code', async () => {
      const err = await errorFrom({
        status: 400,
        body: { error: 'SOME_CODE', detail: 'Detailed message' },
      })
      expect(err.code).toBe('SOME_CODE')
      expect(err.message).toBe('Detailed message')
    })

    it('object error message takes precedence over detail', async () => {
      const err = await errorFrom({
        status: 400,
        body: {
          error: { message: 'From error', code: 'C1' },
          detail: 'From detail',
        },
      })
      expect(err.message).toBe('From error')
      expect(err.code).toBe('C1')
    })
  })

  describe('top-level `message`', () => {
    it('used when no error/detail present', async () => {
      const err = await errorFrom({
        status: 400,
        body: { message: 'Plain message' },
      })
      expect(err.message).toBe('Plain message')
      expect(err.code).toBeUndefined()
    })
  })

  describe('body fallbacks (non-JSON / unreadable)', () => {
    it('HTML body (starts with <) → default message', async () => {
      const err = await errorFrom({
        status: 500,
        contentType: 'text/html',
        body: '<html><body>Boom</body></html>',
      })
      expect(err.message).toBe('Server Error')
    })

    it('body containing <!DOCTYPE → default message', async () => {
      const err = await errorFrom({
        status: 502,
        contentType: 'text/html',
        body: '<!DOCTYPE html><html></html>',
      })
      expect(err.message).toBe('Bad Gateway')
    })

    it('short plain-text body (<200, no <) → returned verbatim', async () => {
      const err = await errorFrom({
        status: 400,
        contentType: 'text/plain',
        body: 'something went sideways',
      })
      expect(err.message).toBe('something went sideways')
    })

    it('long plain-text body (>=200 chars) → default message', async () => {
      const longText = 'x'.repeat(250)
      const err = await errorFrom({
        status: 400,
        contentType: 'text/plain',
        body: longText,
      })
      expect(err.message).toBe('Bad Request')
    })

    it('empty JSON body (parse yields null) → fallback to body text/default', async () => {
      // content-type json but body unreadable as JSON and empty text
      const err = await errorFrom({
        status: 500,
        contentType: 'application/json',
        unreadable: true,
      })
      expect(err.message).toBe('Server Error')
    })

    it('JSON content-type but empty object body → falls back to body text', async () => {
      const err = await errorFrom({
        status: 404,
        contentType: 'application/json',
        body: {},
      })
      // {} yields no message/code, so the JSON branch returns nothing and the
      // fallback returns the short, tag-free serialized body verbatim.
      expect(err.message).toBe('{}')
    })

    it('unreadable body entirely → default message', async () => {
      const err = await errorFrom({
        status: 503,
        contentType: 'text/plain',
        unreadable: true,
      })
      expect(err.message).toBe('Service Unavailable')
    })
  })

  describe('status-code → default message map', () => {
    const cases: Array<[number, string]> = [
      [403, 'Forbidden'],
      [404, 'Not Found'],
      [422, 'Invalid Data'],
      [429, 'Too Many Requests'],
      [500, 'Server Error'],
      [502, 'Bad Gateway'],
      [503, 'Service Unavailable'],
      [504, 'Gateway Timeout'],
      [418, 'Bad Request'], // generic 4xx
      [599, 'Server Error'], // generic 5xx
      [399, 'An Error Occurred'], // below 400 (odd, but pins behavior)
    ]
    for (const [status, expected] of cases) {
      it(`status ${status} → "${expected}"`, async () => {
        const err = await errorFrom({
          status,
          contentType: 'text/html',
          body: '<x>',
        })
        expect(err.message).toBe(expected)
        expect(err.status).toBe(status)
      })
    }
  })
})
