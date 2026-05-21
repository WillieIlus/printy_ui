<template>
  <UiCard>
    <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Next action</p>
    <h3 class="mt-3 text-xl font-black text-slate-950">{{ title }}</h3>
    <p class="mt-2 text-sm leading-6 text-slate-600">{{ description }}</p>
    <div v-if="job.requires_login" class="mt-5">
      <UiButton to="/auth/login">Log in for deeper job history</UiButton>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/UiButton.vue'
import UiCard from '~/components/ui/UiCard.vue'

const props = defineProps<{
  job: Record<string, any>
}>()

const title = computed(() => {
  const status = String(props.job.status || '').toLowerCase()
  if (status.includes('open')) return 'A printer needs to claim this job.'
  if (status.includes('claimed')) return 'A print partner has taken ownership.'
  if (status.includes('closed')) return 'This public job request is no longer open.'
  return 'Check the latest public status above.'
})

const description = computed(() => {
  if (props.job.requires_login) {
    return 'Public tracking is intentionally limited. Sign in to view role-specific actions when you have account access.'
  }
  return 'This token view only exposes safe public status.'
})
</script>
