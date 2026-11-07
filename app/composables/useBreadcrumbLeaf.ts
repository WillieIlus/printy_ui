import { computed, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { BREADCRUMB_LEAF_KEY } from '~/shared/breadcrumbs'

/**
 * Publishes the record a dashboard page is currently showing (a job code such
 * as MJ-20261020-0022) as the last breadcrumb, so the shared trail reads
 * "Dashboard > Quotes > MJ-20261020-0022". The leaf clears when the page stops
 * showing a record or unmounts, so a stale code never survives navigation.
 */
export function useBreadcrumbLeaf(source: Ref<string | null | undefined> | ComputedRef<string | null | undefined>): ComputedRef<string> {
  const leaf = useState<string>(BREADCRUMB_LEAF_KEY, () => '')
  const value = computed(() => String(source.value ?? '').trim())

  watch(
    value,
    (next) => {
      leaf.value = next
    },
    { immediate: true },
  )

  onUnmounted(() => {
    leaf.value = ''
  })

  return value
}
