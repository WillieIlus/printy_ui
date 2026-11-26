<script setup lang="ts">
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
const error = ref('')

const id = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  return /^\d+$/.test(String(value ?? '')) ? Number(value) : null
})

onMounted(async () => {
  if (!id.value) {
    error.value = 'That order link is missing a valid reference.'
    return
  }
  const type = String(route.query.type || '')
  if (type === 'request') {
    await navigateTo(`/app/buyer/requests/${id.value}`, { replace: true })
    return
  }
  if (type === 'job') {
    await navigateTo(`/app/buyer/jobs/${id.value}`, { replace: true })
    return
  }
  try {
    await api(API.managedJobs.card(id.value))
    await navigateTo(`/app/buyer/jobs/${id.value}`, { replace: true })
  } catch {
    await navigateTo(`/app/buyer/requests/${id.value}`, { replace: true })
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-[760px] py-10">
    <DesignLoading v-if="!error" label="Opening your order…" />
    <DesignAlert v-else tone="error" title="We couldn't open that order">
      {{ error }}
    </DesignAlert>
  </div>
</template>
