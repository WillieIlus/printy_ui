import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

function reducedMotion(): boolean {
  return import.meta.client
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Animates a figure from the previously observed real value to the next real
 * value. It never invents intermediate business data: every frame is
 * interpolated between two numbers the backend actually returned, and it snaps
 * straight to the target when the visitor prefers reduced motion.
 */
export function useCountUp(target: Ref<number | null>, duration = 520) {
  const shown = ref<number | null>(null)
  let frame: number | null = null

  function stop() {
    if (frame !== null) {
      cancelAnimationFrame(frame)
      frame = null
    }
  }

  function run(from: number, to: number) {
    stop()
    const started = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      shown.value = from + (to - from) * eased
      if (t < 1) {
        frame = requestAnimationFrame(step)
      } else {
        frame = null
        shown.value = to
      }
    }
    frame = requestAnimationFrame(step)
  }

  watch(
    target,
    (to, from) => {
      if (to === null || !Number.isFinite(to)) {
        stop()
        shown.value = null
        return
      }
      const previous = from === null || from === undefined || !Number.isFinite(from) ? null : from
      if (previous === null || previous === to || reducedMotion() || duration <= 0) {
        stop()
        shown.value = to
        return
      }
      run(previous, to)
    },
    { immediate: true },
  )

  onBeforeUnmount(stop)

  return { shown }
}
