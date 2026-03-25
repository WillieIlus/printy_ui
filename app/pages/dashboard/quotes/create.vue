<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Create Quote File"
      subtitle="Start one grouped quote file for a person or company, then attach shop-specific quote sections."
    >
      <template #actions>
        <UButton variant="soft" size="sm" to="/dashboard/quotes">Back</UButton>
      </template>
    </DashboardPageHeader>

    <form class="max-w-2xl space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Shop" required>
        <USelectMenu
          v-model="selectedShop"
          :items="shopOptions"
          value-key="value"
          placeholder="Select initial shop section"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Company / customer name" required>
        <UInput v-model="companyName" placeholder="Acme Ltd or John Doe" />
      </UFormField>
      <UFormField label="Contact name">
        <UInput v-model="contactName" placeholder="Primary contact person" />
      </UFormField>
      <UFormField label="Customer email">
        <UInput v-model="contactEmail" type="email" placeholder="contact@example.com" />
      </UFormField>
      <UFormField label="Customer phone">
        <UInput v-model="contactPhone" placeholder="+254 700 000 000" />
      </UFormField>
      <div class="flex gap-2">
        <UButton type="submit" color="primary" :loading="loading">
          Create Quote File
        </UButton>
        <UButton variant="soft" to="/dashboard/quotes">Cancel</UButton>
      </div>
    </form>

    <div v-if="!sellerStore.shops.length && !sellerStore.loading" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-store" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to create grouped quote files.</p>
      <UButton color="primary" class="mt-4" to="/dashboard/shops/create">Create shop</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createQuoteDraftFile, getActiveDraft } from '~/services/quoteDraft'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const sellerStore = useSellerStore()
const api = useApi()
const notification = useNotification()

const selectedShop = ref<{ value: number; label: string; slug: string } | null>(null)
const companyName = ref('')
const contactName = ref('')
const contactEmail = ref('')
const contactPhone = ref('')
const loading = ref(false)

const shopOptions = computed(() =>
  sellerStore.shops.map((shop) => ({
    value: shop.id,
    label: `${shop.name} (${shop.slug})`,
    slug: shop.slug,
  }))
)

onMounted(() => {
  void sellerStore.fetchShops()
})

async function onSubmit() {
  if (!selectedShop.value) {
    notification.error('Please select a shop')
    return
  }
  if (!companyName.value.trim()) {
    notification.error('Please enter a customer or company name')
    return
  }

  loading.value = true
  try {
    const file = await createQuoteDraftFile({
      company_name: companyName.value.trim(),
      contact_name: contactName.value.trim(),
      contact_email: contactEmail.value.trim(),
      contact_phone: contactPhone.value.trim(),
    }, api)

    await getActiveDraft(selectedShop.value.slug, file.id, api)
    notification.success('Quote file created')
    await navigateTo(`/dashboard/quotes/files/${file.id}`)
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Failed to create quote file')
  } finally {
    loading.value = false
  }
}
</script>
