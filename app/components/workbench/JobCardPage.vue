<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import DesignJobCard from '~/components/design/job/JobCard.vue'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'
import type { JobCardEnvelope } from '~/shared/job-card'
import type { ViewerRole } from '~/shared/vocabulary'

const props = withDefaults(defineProps<{
  jobId: number
  viewerRole: ViewerRole
  backTo: string
  backLabel?: string
  fallbackTarget?: string
}>(), {
  backLabel: 'Back',
  fallbackTarget: '',
})

const { api } = useApi()
const card = ref<JobCardEnvelope | null>(null)
const shopOptions = ref<Array<{ id: number; name: string; location?: string }>>([])
const loading = ref(true)
const error = ref('')

async function loadShopOptions() {
  if (props.viewerRole !== 'manager') {
    shopOptions.value = []
    return
  }
  try {
    const payload = await api<{ results?: any[] } | any[]>(API.partner.productionShops)
    shopOptions.value = (normalizeApiList(payload) as any[]).map(shop => ({
      id: Number(shop.id ?? shop.shop_id),
      name: String(shop.name ?? shop.shop_name ?? 'Printer'),
      location: String(shop.location ?? shop.city ?? ''),
    })).filter(shop => Number.isFinite(shop.id))
  } catch {
    shopOptions.value = []
  }
}

async function load() {
  if (!props.jobId) {
    error.value = 'That job card link is missing a valid job id.'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    const [payload] = await Promise.all([
      api<JobCardEnvelope>(API.managedJobs.card(props.jobId)),
      loadShopOptions(),
    ])
    card.value = payload && Array.isArray(payload.jobs) ? payload : null
    if (!card.value) error.value = 'This job card is not available.'
  } catch (caught) {
    card.value = null
    error.value = getApiErrorMessage(caught) || "We couldn't load this job card."
  } finally {
    loading.value = false
  }
}

function onUpdated(next: JobCardEnvelope) {
  if (next && Array.isArray(next.jobs)) card.value = next
}

onMounted(load)
watch(() => props.jobId, load)
</script>

<template>
  <div class="flex flex-col gap-5">
    <NuxtLink
      :to="props.backTo"
      class="inline-flex min-h-11 items-center gap-1.5 self-start font-mono text-[10.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
    >
      {{ props.backLabel }}
    </NuxtLink>

    <DesignJobCard
      :card="card"
      :viewer-role="props.viewerRole"
      :loading="loading"
      :error="error"
      :fallback-target="props.fallbackTarget"
      :shop-options="shopOptions"
      @updated="onUpdated"
      @note-added="load"
    />
  </div>
</template>
