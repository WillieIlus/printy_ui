import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const LAYOUTS_DIR = path.resolve(process.cwd(), 'app/layouts')

describe('default layout SSR-safe live clock', () => {
  const src = readFileSync(path.join(LAYOUTS_DIR, 'default.vue'), 'utf8')

  it('must not call setInterval in setup; only inside onMounted', () => {
    expect(src).toContain('onMounted(() => {')
    const onMountedIndex = src.indexOf('onMounted(() => {')
    const setIntervalIndex = src.indexOf('setInterval(')
    expect(setIntervalIndex, 'setInterval should exist').toBeGreaterThan(-1)
    expect(
      setIntervalIndex,
      'setInterval must be defined after onMounted starts (client-only)',
    ).toBeGreaterThan(onMountedIndex)
    expect(src).toMatch(/onMounted\(\(\) => \{\n\s+liveNow\.value = formatLiveNow\(\)\n\s+clockInterval = setInterval\(/)
  })

  it('still clears the interval on unmount', () => {
    expect(src).toContain('onUnmounted')
    expect(src).toContain('clearInterval')
    expect(src).toMatch(/onUnmounted\(\(\) => \{\n\s+if \(clockInterval !== null\) \{\n\s+clearInterval\(clockInterval\)/)
  })

  it('renders an empty clock on SSR and formats the time only on mount', () => {
    expect(src).toContain("ref('')")
    expect(src).toMatch(/onMounted\(\(\) => \{\n\s+liveNow\.value = formatLiveNow\(\)/)
    const onMountedIndex = src.indexOf('onMounted(() => {')
    const liveNowInitIndex = src.indexOf("ref('')")
    expect(liveNowInitIndex, 'liveNow should start empty to avoid a hydration mismatch').toBeGreaterThan(-1)
    expect(liveNowInitIndex).toBeLessThan(onMountedIndex)
  })
})