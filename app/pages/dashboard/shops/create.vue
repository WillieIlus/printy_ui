<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Create shop"
      subtitle="Add a new business listing"
    >
      <template #actions>
        <UButton to="/dashboard/shops" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <div class="max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Shop name" required>
          <UInput v-model="form.name" placeholder="e.g. My Print Shop" required />
        </UFormField>
        <UFormField label="Slug (URL-friendly)">
          <UInput v-model="form.slug" placeholder="e.g. my-print-shop (optional)" />
        </UFormField>
        <UFormField label="Currency">
          <UInput v-model="form.currency" placeholder="e.g. KES" />
        </UFormField>
        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_active" />
          <span class="text-sm">Active</span>
        </div>
        <div class="flex gap-2 pt-4">
          <UButton type="submit" color="primary" :loading="saving">Create shop</UButton>
          <UButton variant="ghost" @click="navigateTo('/dashboard/shops')">Cancel</UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createSellerShop } from '~/services/seller'
import { useSellerStore } from '~/stores/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const sellerStore = useSellerStore()
const toast = useToast()

const form = reactive({
  name: '',
  slug: '',
  currency: 'KES',
  is_active: true,
})

const saving = ref(false)

async function onSubmit() {
  saving.value = true
  try {
    const body: Record<string, unknown> = {
      name: form.name,
      currency: form.currency || undefined,
      is_active: form.is_active,
    }
    if (form.slug) body.slug = form.slug
    const shop = await createSellerShop(body)
    await sellerStore.fetchShops()
    toast.add({ title: 'Shop created', color: 'success' })
    await navigateTo(`/dashboard/shops/${shop.id}/setup`)
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to create', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
