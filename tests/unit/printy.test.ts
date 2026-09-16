import { describe, it, expect } from 'vitest'

import {
  ACTIVE_STATUSES,
  INITIAL_JOBS,
  PRINTERS,
  STAGES,
  advancePress,
  approveArtwork,
  assignPrinter,
  confirmDelivery,
  custody,
  managerStats,
  money,
  nextStage,
  nudge,
  payJob,
  pressLabel,
  prn,
  pulse,
  requestChanges,
  resolveDispute,
  slaRatio,
  slaTone,
  stIdx,
  type Job,
} from '~/shared/workflow/printy'

const j2 = INITIAL_JOBS.find((j) => j.id === 'j2')!
const j3 = INITIAL_JOBS.find((j) => j.id === 'j3')!
const j4 = INITIAL_JOBS.find((j) => j.id === 'j4')!
const j1 = INITIAL_JOBS.find((j) => j.id === 'j1')!

describe('money', () => {
  it('formats with en-US thousands separators and $', () => {
    expect(money(2340)).toBe('$2,340')
    expect(money(410)).toBe('$410')
    expect(money(1000000)).toBe('$1,000,000')
  })

  it('handles zero', () => {
    expect(money(0)).toBe('$0')
  })
})

describe('stages', () => {
  it('STAGES has 10 entries ending at completed', () => {
    expect(STAGES).toHaveLength(10)
    expect(STAGES[9]?.key).toBe('completed')
  })

  it('stIdx finds stages', () => {
    expect(stIdx('quote')).toBe(0)
    expect(stIdx('completed')).toBe(9)
    expect(stIdx('printing')).toBe(5)
  })

  it('nextStage returns the next stage key', () => {
    expect(nextStage(j2)).toMatchObject({ key: 'payment' })
  })

  it('nextStage of completed is null', () => {
    const completed = INITIAL_JOBS.find((j) => j.id === 'j7')!
    expect(nextStage(completed)).toBeNull()
  })
})

describe('prn', () => {
  it('finds a printer by id', () => {
    expect(prn('p-north')?.name).toBe('North Press Co.')
    expect(prn('p-halftone')?.name).toBe('Halftone Works')
  })

  it('returns null for unknown or null id', () => {
    expect(prn('p-missing')).toBeNull()
    expect(prn(null)).toBeNull()
  })

  it('all printers have required fields', () => {
    for (const p of PRINTERS) {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(Array.isArray(p.caps)).toBe(true)
      expect(typeof p.rating).toBe('number')
    }
  })
})

describe('approveArtwork', () => {
  it('moves a job from approval to payment', () => {
    const next = approveArtwork(j2)
    expect(next.stage).toBe('payment')
    expect(next.status).toBe('on-track')
    expect(next.owner.role).toBe('Buyer')
  })

  it('appends an approval history event', () => {
    const next = approveArtwork(j2)
    expect(next.history).toHaveLength(j2.history.length + 1)
    expect(next.history.at(-1)?.stage).toBe('approval')
  })

  it('is a no-op for a job not at approval', () => {
    expect(approveArtwork(j1)).toBe(j1)
  })
})

describe('requestChanges', () => {
  it('returns a job to artwork as at-risk', () => {
    const next = requestChanges(j2)
    expect(next.stage).toBe('artwork')
    expect(next.status).toBe('at-risk')
    expect(next.owner.role).toBe('Studio')
  })

  it('is a no-op for a non-approval job', () => {
    expect(requestChanges(j1)).toBe(j1)
  })
})

describe('payJob', () => {
  it('moves a job from payment to production', () => {
    const next = payJob(j3)
    expect(next.stage).toBe('production')
    expect(next.custody).toBe('held')
    expect(next.owner.role).toBe('Manager')
  })

  it('is a no-op when not at payment', () => {
    expect(payJob(j1)).toBe(j1)
  })
})

describe('assignPrinter', () => {
  it('assigns an unassigned production job to a printer', () => {
    const next = assignPrinter(j4, 'p-north')
    expect(next.stage).toBe('printing')
    expect(next.printerId).toBe('p-north')
    expect(next.press).toBe('accept')
    expect(next.status).toBe('on-track')
  })

  it('is a no-op when the job already has a printer', () => {
    expect(assignPrinter(j1, 'p-halftone')).toBe(j1)
  })

  it('is a no-op when not at production', () => {
    expect(assignPrinter(j2, 'p-north')).toBe(j2)
  })
})

describe('advancePress', () => {
  it('walks the full printing->delivery chain', () => {
    expect(j1.press).toBe('ready')
    expect(j1.stage).toBe('printing')
    const s2 = advancePress(j1)
    expect(s2.press).toBe('active')
    expect(s2.progress).toBe(14)
    const s3 = advancePress(s2)
    expect(s3.press).toBe('ready')
    expect(s3.stage).toBe('finishing')
    const s4 = advancePress(s3)
    expect(s4.press).toBe('active')
    expect(s4.progress).toBe(32)
    const s5 = advancePress(s4)
    expect(s5.stage).toBe('qc')
    expect(s5.press).toBe('ready')
    const s6 = advancePress(s5)
    expect(s6.press).toBe('active')
    expect(s6.progress).toBe(60)
    const s7 = advancePress(s6)
    expect(s7.stage).toBe('delivery')
    expect(s7.press).toBeNull()
  })

  it('is a no-op for non-printing stages', () => {
    expect(advancePress(j2)).toBe(j2)
  })
})

describe('confirmDelivery', () => {
  it('completes a delivery-stage job', () => {
    const deliveryJob = INITIAL_JOBS.find((j) => j.id === 'j5')!
    const next = confirmDelivery(deliveryJob)
    expect(next.stage).toBe('completed')
    expect(next.status).toBe('completed')
    expect(next.custody).toBe('released')
  })

  it('is a no-op for non-delivery jobs', () => {
    expect(confirmDelivery(j2)).toBe(j2)
  })
})

describe('resolveDispute', () => {
  it('resolves a disputed job', () => {
    const disputed = INITIAL_JOBS.find((j) => j.id === 'j6')!
    const next = resolveDispute(disputed)
    expect(next.status).toBe('on-track')
    expect(next.dispute?.resolved).toBe(true)
  })

  it('is a no-op for non-disputed jobs', () => {
    expect(resolveDispute(j2)).toBe(j2)
  })
})

describe('nudge', () => {
  it('prepends a feed entry', () => {
    const next = nudge(j2, 'Ava Lindqvist')
    expect(next.feed).toHaveLength(j2.feed.length + 1)
    expect(next.feed[0]?.who).toBe('Ava Lindqvist')
    expect(next.feed[0]?.jobCode).toBe(j2.code)
  })
})

describe('pulse', () => {
  it('tallies statuses across jobs', () => {
    const p = pulse(INITIAL_JOBS)
    expect(p.total).toBe(INITIAL_JOBS.length)
    expect(p.onTrack + p.atRisk + p.overdue + p.disputed).toBe(INITIAL_JOBS.length - p.completed)
  })
})

describe('custody', () => {
  it('sums value by custody state', () => {
    const c = custody(INITIAL_JOBS)
    const manualHeld = INITIAL_JOBS.filter((j) => j.custody === 'held').reduce((a, j) => a + j.value, 0)
    expect(c.held).toBe(manualHeld)
  })
})

describe('managerStats', () => {
  it('scopes a managers jobs and risk', () => {
    const dale = managerStats(INITIAL_JOBS, 'm-dale')
    expect(dale.jobs.map((j) => j.id).sort()).toEqual(['j1', 'j6'])
    expect(dale.disputed).toBe(1)
  })
})

describe('sla', () => {
  it('computes ratios and tones', () => {
    const ok = { ...j2, owner: { ...j2.owner, waitingHrs: 10, slaHrs: 100 } }
    const tight = { ...j2, owner: { ...j2.owner, waitingHrs: 70, slaHrs: 100 } }
    const breach = { ...j2, owner: { ...j2.owner, waitingHrs: 100, slaHrs: 100 } }
    expect(slaRatio(ok)).toBe(0.1)
    expect(slaTone(ok)).toBe('ok')
    expect(slaTone(tight)).toBe('tight')
    expect(slaTone(breach)).toBe('breach')
  })

  it('treats slaHrs 0 as ok', () => {
    const zero = { ...j2, owner: { ...j2.owner, waitingHrs: 50, slaHrs: 0 } }
    expect(slaRatio(zero)).toBe(0)
    expect(slaTone(zero)).toBe('ok')
  })
})

describe('pressLabel', () => {
  it('labels the current press action', () => {
    expect(pressLabel(j1)).toBe('Start printing')
    const accept = { ...j1, press: 'accept' as const }
    expect(pressLabel(accept)).toBe('Accept job')
  })

  it('returns null when no press action applies', () => {
    expect(pressLabel({ ...j2, press: null })).toBeNull()
  })
})

describe('ACTIVE_STATUSES', () => {
  it('excludes completed', () => {
    expect(ACTIVE_STATUSES).not.toContain('completed')
    expect(ACTIVE_STATUSES).toContain('on-track')
  })
})