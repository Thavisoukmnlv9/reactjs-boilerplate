import { describe, expect, it } from 'vitest'

import { bpsToPercent, percentToBps } from '../FormPercentBps'

describe('basis-points conversion helpers', () => {
  it('converts 0 bps to 0%', () => {
    expect(bpsToPercent(0)).toBe(0)
  })

  it('converts 10000 bps to 100%', () => {
    expect(bpsToPercent(10000)).toBe(100)
  })

  it('converts 750 bps to 7.5%', () => {
    expect(bpsToPercent(750)).toBe(7.5)
  })

  it('rounds fractional bps to the nearest integer', () => {
    expect(bpsToPercent(751.4)).toBe(7.51)
    expect(bpsToPercent(751.6)).toBe(7.52)
  })

  it('handles non-finite input by returning 0', () => {
    expect(bpsToPercent(Number.NaN)).toBe(0)
    expect(bpsToPercent(Number.POSITIVE_INFINITY)).toBe(0)
  })

  it('converts 7.5% back to 750 bps', () => {
    expect(percentToBps(7.5)).toBe(750)
  })

  it('round-trips through bps → percent → bps', () => {
    for (const bps of [0, 100, 750, 2000, 10000]) {
      expect(percentToBps(bpsToPercent(bps))).toBe(bps)
    }
  })

  it('handles non-finite percent input by returning 0', () => {
    expect(percentToBps(Number.NaN)).toBe(0)
  })
})
