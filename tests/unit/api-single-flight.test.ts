import { describe, it, expect } from 'vitest'
import { createSingleFlight } from '~/shared/api'

describe('createSingleFlight', () => {
  it('runs the task once for concurrent callers and shares the result', async () => {
    let runs = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    const single = createSingleFlight(async () => {
      runs += 1
      await gate
      return 'ok'
    })

    const p1 = single()
    const p2 = single()
    const p3 = single()
    release()
    const results = await Promise.all([p1, p2, p3])

    expect(results).toEqual(['ok', 'ok', 'ok'])
    expect(runs).toBe(1)
  })

  it('allows a fresh run once the previous attempt settles', async () => {
    let runs = 0
    const single = createSingleFlight(async () => {
      runs += 1
    })

    await Promise.all([single(), single()])
    await single()

    expect(runs).toBe(2)
  })

  it('propagates the same rejection to every concurrent caller', async () => {
    let runs = 0
    const single = createSingleFlight(async () => {
      runs += 1
      throw new Error('refresh rejected')
    })

    const p1 = single().catch((e: unknown) => (e as Error).message)
    const p2 = single().catch((e: unknown) => (e as Error).message)
    const messages = await Promise.all([p1, p2])

    expect(messages).toEqual(['refresh rejected', 'refresh rejected'])
    expect(runs).toBe(1)
  })
})