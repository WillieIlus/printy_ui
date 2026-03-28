<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="t('jobs.createTitle')"
      :subtitle="t('jobs.createSubtitle')"
    >
      <template #actions>
        <UButton variant="soft" size="sm" to="/dashboard/jobs">{{ t('common.back') }}</UButton>
      </template>
    </DashboardPageHeader>

    <form class="max-w-xl space-y-4" @submit.prevent="onSubmit">
      <UFormField :label="t('jobs.fields.title')" required>
        <UInput v-model="title" :placeholder="t('jobs.placeholders.title')" />
      </UFormField>
      <UFormField :label="t('jobs.fields.productCategory')">
        <UInput v-model="form.product" :placeholder="t('jobs.placeholders.productCategory')" />
      </UFormField>
      <div class="grid grid-cols-2 gap-4">
        <UFormField :label="t('jobs.fields.size')">
          <UInput v-model="form.size" :placeholder="t('jobs.placeholders.size')" />
        </UFormField>
        <UFormField :label="t('jobs.fields.quantity')">
          <UInput v-model.number="form.quantity" type="number" :placeholder="t('jobs.placeholders.quantity')" />
        </UFormField>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <UFormField :label="t('jobs.fields.paper')">
          <UInput v-model="form.paper" :placeholder="t('jobs.placeholders.paper')" />
        </UFormField>
        <UFormField :label="t('jobs.fields.finishing')">
          <UInput v-model="form.finishing" :placeholder="t('jobs.placeholders.finishing')" />
        </UFormField>
      </div>
      <UFormField :label="t('common.location')">
        <UInput v-model="location" :placeholder="t('jobs.placeholders.location')" />
      </UFormField>
      <UFormField :label="t('common.deadline')">
        <UInput v-model="deadline" type="datetime-local" />
      </UFormField>
      <div class="flex gap-2">
        <UButton type="submit" color="primary" :loading="loading">
          {{ t('common.create') }}
        </UButton>
        <UButton variant="soft" to="/dashboard/jobs">{{ t('common.cancel') }}</UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const jobRequests = useJobRequests()
const notification = useNotification()

const title = ref('')
const location = ref('')
const deadline = ref('')
const form = reactive({
  product: '',
  size: '',
  quantity: '' as string | number,
  paper: '',
  finishing: '',
})
const loading = ref(false)

async function onSubmit() {
  if (!title.value.trim()) {
    notification.error(t('jobs.feedback.titleRequired'))
    return
  }
  loading.value = true
  try {
    const cleanSpecs: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(form)) {
      if (value !== '' && value !== null && value !== undefined) {
        cleanSpecs[key] = typeof value === 'number' ? value : String(value).trim()
      }
    }
    const job = await jobRequests.create({
      title: title.value.trim(),
      specs: Object.keys(cleanSpecs).length ? cleanSpecs : undefined,
      location: location.value.trim() || undefined,
      deadline: deadline.value ? new Date(deadline.value).toISOString() : null,
    })
    notification.success(t('jobs.feedback.createSuccess'))
    await navigateTo(`/dashboard/jobs/${job.id}`)
  } catch (e) {
    notification.error(e instanceof Error ? e.message : t('jobs.feedback.createFailed'))
  } finally {
    loading.value = false
  }
}
</script>
