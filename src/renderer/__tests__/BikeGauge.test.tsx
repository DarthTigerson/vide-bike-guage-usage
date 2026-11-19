import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BikeGauge } from '../BikeGauge'
import { setVide } from '../vide'
import { activate, deactivate } from '../index'
import type { UsagePace, UsageViewProps, UsageWindow, VideRendererApi } from '../../vide'

// Port of vIDE core's computePace (what `vide.usage.pace` returns).
const clamp = (n: number) => Math.max(0, Math.min(100, n))
function pace(w: UsageWindow, now: number): UsagePace {
  if (w.pct == null || w.resetAt == null) return { elapsedPct: null, projectedPct: null, status: null }
  const hoursLeft = Math.max(0, (w.resetAt - now) / 3_600_000)
  const elapsedPct = clamp((1 - hoursLeft / w.windowHours) * 100)
  const projectedPct = w.ratePerHour == null ? null : clamp(w.pct + w.ratePerHour * hoursLeft)
  const status = w.cutoffAt != null ? 'runs-out' : w.pct <= elapsedPct ? 'under' : 'ahead'
  return { elapsedPct, projectedPct, status }
}

const now = Date.now()
const SESSION: UsageWindow = { label: 'Session', pct: 38, resetAt: now + 3_600_000, ratePerHour: 30.55, cutoffAt: null, windowHours: 5 }
const WEEK: UsageWindow = { label: 'Week', pct: 56, resetAt: now + 86_400_000, ratePerHour: 0.73, cutoffAt: null, windowHours: 168 }

const props = (over: Partial<UsageViewProps> = {}): UsageViewProps => ({ session: SESSION, week: WEEK, now, ...over })

beforeEach(() => setVide({ usage: { pace } } as unknown as VideRendererApi))
afterEach(() => { cleanup(); setVide(null) })

describe('BikeGauge', () => {
  it('shows a speedometer for session and a fuel gauge for week, with chips and footers', () => {
    render(<BikeGauge {...props()} />)
    expect(screen.getByTestId('usage-gauges')).toBeTruthy()
    expect(screen.getByText('38%')).toBeTruthy()
    expect(screen.getByText('56%')).toBeTruthy()
    expect(screen.getByText('≈30.55%/hr')).toBeTruthy()
    expect(screen.getByText('≈0.73%/hr')).toBeTruthy()
    expect(screen.getByText('Under pace · 69% at reset')).toBeTruthy()
    expect(screen.getAllByTestId('gauge-now')).toHaveLength(2)
    expect(screen.getByTestId('gauge-week').textContent).toMatch(/E.*F/)
    expect(screen.getByTestId('fuel-light')).toHaveAttribute('data-out', 'false')
  })

  it('lights the fuel warning red when a limit is reached', () => {
    render(<BikeGauge {...props({ week: { ...WEEK, pct: 100 } })} />)
    expect(screen.getByTestId('fuel-light')).toHaveAttribute('data-out', 'true')
    expect(screen.getByTestId('fuel-light').textContent).toContain('Out of usage: week limit reached')
    expect(screen.getByText('Limit reached')).toBeTruthy()
  })

  it('shows a runs-out chip with a countdown when a cutoff is predicted', () => {
    render(<BikeGauge {...props({ session: { ...SESSION, cutoffAt: now + 2 * 3_600_000 + 5 * 60_000 } })} />)
    expect(screen.getByText(/^Runs out in \d+h \d+m$/)).toBeTruthy()
  })

  it('draws no pace chip or elapsed marker without a reset time', () => {
    render(<BikeGauge {...props({ session: { ...SESSION, resetAt: null }, week: { ...WEEK, resetAt: null } })} />)
    expect(screen.queryByTestId('pace-chip')).toBeNull()
    expect(screen.queryByTestId('gauge-now')).toBeNull()
  })

  it('shows a dash for an unknown percentage', () => {
    render(<BikeGauge {...props({ session: { ...SESSION, pct: null } })} />)
    expect(screen.getByTestId('gauge-session').textContent).toContain('—')
  })
})

describe('activate / deactivate', () => {
  it('registers one view titled Bike Gauge and disposes it', () => {
    let disposed = 0
    const registered: Array<{ title: string; component: unknown }> = []
    const vide = {
      usage: { registerView: (p: { title: string; component: unknown }) => { registered.push(p); return { dispose: () => { disposed++ } } }, pace },
    } as unknown as VideRendererApi
    activate(vide)
    expect(registered).toHaveLength(1)
    expect(registered[0].title).toBe('Bike Gauge')
    expect(registered[0].component).toBe(BikeGauge)
    deactivate()
    expect(disposed).toBe(1)
  })
})
