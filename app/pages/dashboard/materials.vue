<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">Materials</h1>
        <p class="text-sm text-[var(--p-text-muted)]">Manage large-format materials (vinyl, banner, etc.).</p>
      </div>
      <div class="flex items-center gap-3">
        <USelectMenu
          v-if="sellerStore.shops.length > 1"
          v-model="selectedSlug"
          :items="shopOptions"
          value-key="value"
          class="w-48"
        />
        <UButton color="primary" :disabled="!selectedSlug" @click="goToShopSetup">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add material
        </UButton>
      </div>
    </div>

    <div v-if="!sellerStore.shops.length && !sellerStore.loading" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-store" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to manage materials.</p>
      <UButton color="primary" class="mt-4" to="/dashboard/shops/create">Create shop</UButton>
    </div>

    <CommonLoadingSpinner v-else-if="loading" />

    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Material type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Unit</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Buying price</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Selling price</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="m in items" :key="m.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ m.material_type }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ m.unit }}</td>
            <td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">{{ m.buying_price }}</td>
            <td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">{{ m.selling_price }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="m.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ m.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-layers" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No materials yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add large-format materials like vinyl, banner, or canvas.</p>
      <UButton color="primary" class="mt-4" @click="goToShopSetup">Add material</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'
import type { Material } from '~/services/seller'
import { listMaterialsBySlug } from '~/services/seller'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const sellerStore = useSellerStore()
const items = ref<Material[]>([])
const loading = ref(true)

const selectedSlug = ref('')
const shopOptions = computed(() =>
  sellerStore.shops.map(s => ({ value: s.slug, label: s.name }))
)

function goToShopSetup() {
  if (selectedSlug.value) {
    navigateTo(`/dashboard/shops/${selectedSlug.value}/setup`)
  }
}

async function load() {
  if (!selectedSlug.value) { loading.value = false; return }
  loading.value = true
  try {
    items.value = await listMaterialsBySlug(selectedSlug.value)
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
