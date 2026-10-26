import { describe, it, expect } from 'vitest'
import { formatJobDuration, jobExpectedTime, jobRelativeTime } from '~/shared/job-time'

const NOW = new Date('2026-10-26T12:00:00Z').getTime()

describe('job time formatting', () => {
  it('renders long relative times for recent job activity', () => {
    expect(jobRelativeTime('2026-10-26T11:00:00Z', NOW)).toBe('1 hour ago')
    expect(jobRelativeTime('2026-10-23T12:00:00Z', NOW)).toBe('3 days ago')
    expect(jobRelativeTime('2026-10-26T11:59:40Z', NOW)).toBe('just now')
  })

  it('formats elapsed durations for scanning', () => {
    expect(formatJobDuration(750)).toBe('12h 30m')
    expect(formatJobDuration(2880)).toBe('2 days')
    expect(formatJobDuration(45)).toBe('45m')
  })

  it('describes expected and overdue deadlines', () => {
    expect(jobExpectedTime(2880, false)).toBe('Expected in 2 days')
    expect(jobExpectedTime(-180, true)).toBe('Overdue by 3h 0m')
    expect(jobExpectedTime(0, false)).toBe('Due now')
    expect(jobExpectedTime(null, false)).toBe('')
    expect(jobExpectedTime(120, false, true)).toBe('Completed')
  })
})
