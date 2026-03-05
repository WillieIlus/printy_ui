<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Create quote"
      subtitle="Start a new quote draft"
    >
      <template #actions>
        <UButton variant="soft" size="sm" to="/dashboard/quotes">Back</UButton>
      </template>
    </DashboardPageHeader>

    <form class="max-w-xl space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Shop" required>
        <USelectMenu
          v-model="selectedShop"
          :items="shopOptions"
          value-key="value"
          placeholder="Select shop"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Customer name">
        <UInput v-model="customerName" placeholder="John Doe" />
      </UFormField>
      <UFormField label="Customer email">
        <UInput v-model="customerEmail" type="email" placeholder="john@example.com" />
      </UFormField>
      <UFormField label="Customer phone">
        <UInput v-model="customerPhone" placeholder="+254 700 000 000" />
      </UFormField>
      <UFormField label="Notes">
        <UTextarea v-model="notes" placeholder="Optional notes..." :rows="3" />
      </UFormField>
      <div class="flex gap-2">
        <UButton type="submit" color="primary" :loading="loading">
          Create quote
        </UButton>
        <UButton variant="soft" to="/dashboard/quotes">Cancel</UButton>
      </div>
    </form>

    <div v-if="!sellerStore.shops.length && !sellerStore.loading" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-store" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to create quotes.</p>
      <UButton color="primary" class="mt-4" to="/dashboard/shops/create">Create shop</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const sellerStore = useSellerStore()
const staffQuotes = useStaffQuotes()
const notification = useNotification()

const selectedShop = ref<{ value: number; label: string } | null>(null)
const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const notes = ref('')
const loading = ref(false)

const shopOptions = computed(() =>
  sellerStore.shops.map((s) => ({ value: s.id, label: `${s.name} (${s.slug})` }))
)

onMounted(() => sellerStore.fetchShops())

async function onSubmit() {
  if (!selectedShop.value) {
    notification.error('Please select a shop')
    return
  }
  loading.value = true
  try {
    const quote = await staffQuotes.create({
      shop: selectedShop.value.value,
      customer_name: customerName.value || undefined,
      customer_email: customerEmail.value || undefined,
      customer_phone: customerPhone.value || undefined,
      notes: notes.value || undefined,
    })
    notification.success('Quote created')
    await navigateTo(`/dashboard/quotes/${quote.id}`)
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to create quote')
  } finally {
    loading.value = false
  }
}
</script>
