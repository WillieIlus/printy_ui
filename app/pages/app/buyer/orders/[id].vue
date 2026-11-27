<script setup lang="ts">
import BuyerJobTimeline from '~/components/workbench/tracker/BuyerJobTimeline.vue'
import BuyerOrderDetailView from '~/components/workbench/views/BuyerOrderDetailView.vue'
import DesignBuyerSurface from '~/components/design/buyer/BuyerSurface.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import { API } from '~/shared/api-paths'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [
    { label: 'My quotes', to: '/app/buyer' },
    { label: 'Order', to: '' },
  ],
})

const route = useRoute()
const { api } = useApi()
const mode = ref<'loading' | 'job' | 'request' | 'error'>('loading')
const error = ref('')

const id = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  return /^\d+$/.test(String(value ?? '')) ? Number(value) : null
})

onMounted(async () => {
  if (!id.value) {
    error.value = 'That order link is missing a valid reference.'
    mode.value = 'error'
    return
  }
  const type = String(route.query.type || '')
  if (type === 'job') {
    mode.value = 'job'
    return
  }
  if (type === 'request') {
    mode.value = 'request'
    return
  }
  try {
    await api(API.managedJobs.card(id.value))
    mode.value = 'job'
  } catch {
    mode.value = 'request'
  }
})
</script>

<template>
  <DesignBuyerSurface>
    <DesignLoading v-if="mode === 'loading'" label="Opening your order…" />
    <DesignAlert v-else-if="mode === 'error'" tone="error" title="We couldn't open that order">{{ error }}</DesignAlert>
    <BuyerJobTimeline v-else-if="mode === 'job' && id" :job-id="id" />
    <BuyerOrderDetailView v-else-if="mode === 'request' && id" :order-id="id" />
  </DesignBuyerSurface>
</template>
