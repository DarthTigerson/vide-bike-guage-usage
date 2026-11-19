import { describe, expect, it } from 'vitest'
import { formatBurnRate, formatCountdown, formatResetTime, paceChipText } from '../format'

describe('format', () => {
  it('formats burn rates', () => {
    expect(formatBurnRate(30.5)).toBe('≈30.50%/hr')
    expect(formatBurnRate(null)).toBe('—')
  })
  it('formats countdowns', () => {
    expect(formatCountdown(null, 0)).toBe('—')
    expect(formatCountdown(1000, 2000)).toBe('now')
    expect(formatCountdown(45 * 60_000, 0)).toBe('45m')
    expect(formatCountdown(125 * 60_000, 0)).toBe('2h 5m')
  })
  it('formats a missing reset time', () => {
    expect(formatResetTime(null)).toBe('—')
  })
  it('builds pace chip text', () => {
    expect(paceChipText('under', 69.2, null, 0)).toBe('Under pace · 69% at reset')
    expect(paceChipText('ahead', null, null, 0)).toBe('Ahead of pace')
    expect(paceChipText('runs-out', 90, 60 * 60_000, 0)).toBe('Runs out in 1h 0m')
  })
})
