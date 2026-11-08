import { onBeforeUnmount, ref } from 'vue'
import type { Ref } from 'vue'

/** Lifecycle-safe debounce helper for 260 ms and 350 ms source timers. */
export function useDebouncedTask<A extends unknown[]>(
  task: (...args: A) => Promise<void> | void,
  delay = 260,
) {
  const pending = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null
  let requestId = 0
  let controller: AbortController | null = null

  function clear() {
    if (timer) clearTimeout(timer)
    timer = null
    controller?.abort()
  }

  async function run(...args: A) {
    const id = ++requestId
    clear()
    pending.value = true
    timer = setTimeout(async () => {
      controller = new AbortController()
      try {
        await task(...args)
      } finally {
        if (id === requestId) pending.value = false
      }
      timer = null
    }, delay)
  }

  onBeforeUnmount(clear)

  return { run, pending, clear }
}

export type DebouncedTask = Ref<boolean>
