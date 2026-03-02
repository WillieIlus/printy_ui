<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">Products</h1>
        <p class="text-sm text-[var(--p-text-muted)]">Manage your product catalog across shops.</p>
      </div>
      <div class="flex items-center gap-3">
        <USelectMenu
          v-if="sellerStore.shops.length > 1"
          v-model="selectedSlug"
          :items="shopOptions"
          value-key="value"
          class="w-48"
        />
        <UButton color="primary" :disabled="!selectedSlug" @click="goToAddProduct">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add product
        </UButton>
      </div>
    </div>

    <div v-if="!sellerStore.shops.length && !sellerStore.loading" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-store" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to manage products.</p>
      <UButton color="primary" class="mt-4" to="/dashboard/shops/create">Create shop</UButton>
    </div>

    <CommonLoadingSpinner v-else-if="loading" />

    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Mode</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Size (mm)</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Min qty</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Finishings</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="p in items" :key="p.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-[var(--p-text)]">{{ p.name }}</div>
              <div v-if="p.category" class="text-xs text-[var(--p-text-muted)]">{{ p.category }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ p.pricing_mode }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ p.default_finished_width_mm }} x {{ p.default_finished_height_mm }}</td>
            <td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">{{ p.min_quantity ?? 1 }}</td>
            <td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">{{ p.finishing_options?.length ?? 0 }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="p.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ p.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="soft" size="xs" :to="`/dashboard/shops/${selectedSlug}/setup`">Manage</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-package" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No products yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add products to your catalog for buyers to quote.</p>
      <UButton color="primary" class="mt-4" @click="goToAddProduct">Add product</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'
import type { Product } from '~/services/seller'
import { listProductsBySlug } from '~/services/seller'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const sellerStore = useSellerStore()
const items = ref<Product[]>([])
const loading = ref(true)

const selectedSlug = ref('')
const shopOptions = computed(() =>
  sellerStore.shops.map(s => ({ value: s.slug, label: s.name }))
)

function goToAddProduct() {
  if (selectedSlug.value) {
    navigateTo(`/dashboard/shops/${selectedSlug.value}/setup`)
  }
}

async function load() {
  if (!selectedSlug.value) { loading.value = false; return }
  loading.value = true
  try {
    items.value = await listProductsBySlug(selectedSlug.value)
  } catch { items.value = [] }
  finally { loading.value = false }
}

watch(selectedSlug, () => load())

onMounted(async () => {
  if (!sellerStore.shops.length) await sellerStore.fetchShops()
  if (sellerStore.shops.length) {
    selectedSlug.value = sellerStore.shops[0].slug
  } else {
    loading.value = false
  }
})
</script>
