import { http, HttpResponse } from 'msw'

import { appConfig } from '@/config/app-config'
import type { User } from '@/features/users/types'
import type { AuthUser } from '@/lib/auth'

const base = appConfig.api.baseUrl

const demoUser: AuthUser = {
  id: 'u_1',
  name: 'Ada Lovelace',
  email: 'admin@example.com',
  roles: ['admin'],
  permissions: ['users:read', 'users:write', 'users:delete'],
}

let users: User[] = [
  {
    id: 'u_1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'admin',
    createdAt: '2024-01-05T10:00:00.000Z',
  },
  {
    id: 'u_2',
    name: 'Alan Turing',
    email: 'alan@example.com',
    role: 'member',
    createdAt: '2024-02-11T09:30:00.000Z',
  },
  {
    id: 'u_3',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'viewer',
    createdAt: '2024-03-02T14:15:00.000Z',
  },
]

let idSeq = 4

export const handlers = [
  http.post(`${base}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.password !== 'password') {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }
    return HttpResponse.json({
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      user: { ...demoUser, email: body.email },
    })
  }),

  http.get(`${base}/auth/me`, () => HttpResponse.json(demoUser)),

  http.get(`${base}/users`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase()
    const result = search
      ? users.filter(
          (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search),
        )
      : users
    return HttpResponse.json(result)
  }),

  http.get(`${base}/users/:id`, ({ params }) => {
    const user = users.find((u) => u.id === params.id)
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({ message: 'User not found' }, { status: 404 })
  }),

  http.post(`${base}/users`, async ({ request }) => {
    const body = (await request.json()) as Omit<User, 'id' | 'createdAt'>
    const user: User = { ...body, id: `u_${idSeq++}`, createdAt: new Date().toISOString() }
    users = [user, ...users]
    return HttpResponse.json(user, { status: 201 })
  }),

  http.put(`${base}/users/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<User>
    users = users.map((u) => (u.id === params.id ? { ...u, ...body } : u))
    const updated = users.find((u) => u.id === params.id)
    return updated
      ? HttpResponse.json(updated)
      : HttpResponse.json({ message: 'User not found' }, { status: 404 })
  }),

  http.delete(`${base}/users/:id`, ({ params }) => {
    users = users.filter((u) => u.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
