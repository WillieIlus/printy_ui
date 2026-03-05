<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Create Job Request"
      subtitle="Share overflow work with other printers"
    >
      <template #actions>
        <UButton variant="soft" size="sm" to="/dashboard/jobs">Back</UButton>
      </template>
    </DashboardPageHeader>

    <form class="max-w-xl space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Title" required>
        <UInput v-model="title" placeholder="e.g. Brochure 500 pcs A4" />
      </UFormField>
      <UFormField label="Product / Category">
        <UInput v-model="form.product" placeholder="e.g. Brochure, Business Card" />
      </UFormField>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Size">
          <UInput v-model="form.size" placeholder="e.g. A4, 90×55mm" />
        </UFormField>
        <UFormField label="Quantity">
          <UInput v-model.number="form.quantity" type="number" placeholder="500" />
        </UFormField>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Paper">
          <UInput v-model="form.paper" placeholder="e.g. 300gsm Gloss" />
        </UFormField>
        <UFormField label="Finishing">
          <UInput v-model="form.finishing" placeholder="e.g. Lamination, Cutting" />
        </UFormField>
      </div>
      <UFormField label="Location">
        <UInput v-model="location" placeholder="e.g. Nairobi, Westlands" />
      </UFormField>
      <UFormField label="Deadline">
        <UInput v-model="deadline" type="datetime-local" />
      </UFormField>
      <div class="flex gap-2">
        <UButton type="submit" color="primary" :loading="loading">
          Create
        </UButton>
        <UButton variant="soft" to="/dashboard/jobs">Cancel</UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
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
    notification.error('Title is required')
    return
  }
  loading.value = true
  try {
    const cleanSpecs: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(form)) {
      if (v !== '' && v !== null && v !== undefined) {
        cleanSpecs[k] = typeof v === 'number' ? v : String(v).trim()
      }
    }
    const job = await jobRequests.create({
      title: title.value.trim(),
      specs: Object.keys(cleanSpecs).length ? cleanSpecs : undefined,
      location: location.value.trim() || undefined,
      deadline: deadline.value ? new Date(deadline.value).toISOString() : null,
    })
    notification.success('Job request created')
    await navigateTo(`/dashboard/jobs/${job.id}`)
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to create')
  } finally {
    loading.value = false
  }
}
</script>
