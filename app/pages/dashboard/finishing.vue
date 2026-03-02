<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">Finishing</h1>
        <p class="text-sm text-[var(--p-text-muted)]">Manage finishing rates (lamination, binding, folding, etc.).</p>
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
          Add finishing
        </UButton>
      </div>
    </div>

    <!-- Category filter -->
    <div v-if="categories.length" class="flex items-center gap-2 flex-wrap">
      <UBadge
        :color="!selectedCategory ? 'primary' : 'neutral'"
        variant="soft"
        class="cursor-pointer"
        @click="selectedCategory = ''"
      >
        All
      </UBadge>
      <UBadge
        v-for="cat in categories"
        :key="cat.slug"
        :color="selectedCategory === cat.slug ? 'primary' : 'neutral'"
        variant="soft"
        class="cursor-pointer"
        @click="selectedCategory = cat.slug"
      >
        {{ cat.name }}
      </UBadge>
    </div>

    <div v-if="!sellerStore.shops.length && !sellerStore.loading" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-store" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to manage finishing rates.</p>
      <UButton color="primary" class="mt-4" to="/dashboard/shops/create">Create shop</UButton>
    </div>

    <CommonLoadingSpinner v-else-if="loading" />

    <div v-else-if="filteredItems.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Category</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Charge unit</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Price</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="f in filteredItems" :key="f.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ f.name }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ f.category_detail?.name ?? '—' }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ f.charge_unit }}</td>
            <td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">{{ f.price }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="f.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ f.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-scissors" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No finishing rates yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add finishing services like lamination, binding, or folding.</p>
      <UButton color="primary" class="mt-4" @click="goToShopSetup">Add finishing</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'
import { useApi } from '~/shared/api'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

interface FinishingCategory {
  id: number
  name: string
  slug: string
  description: string
}

interface FinishingRateWithCategory {
  id: number
  name: string
  category: number | null
  category_detail: FinishingCategory | null
  charge_unit: string
  price: string
  double_side_price: string | null
  setup_fee: string | null
  min_qty: number | null
  is_active: boolean
}

const sellerStore = useSellerStore()
const items = ref<FinishingRateWithCategory[]>([])
const categories = ref<FinishingCategory[]>([])
const loading = ref(true)
const selectedSlug = ref('')
const selectedCategory = ref('')

const shopOptions = computed(() =>
  sellerStore.shops.map(s => ({ value: s.slug, label: s.name }))
)

const filteredItems = computed(() => {
  if (!selectedCategory.value) return items.value
  return items.value.filter(f => f.category_detail?.slug === selectedCategory.value)
})

function goToShopSetup() {
  if (selectedSlug.value) {
    navigateTo(`/dashboard/shops/${selectedSlug.value}/setup`)
  }
}

async function loadCategories() {
  const api = useApi()
  try {
    const data = await api<FinishingCategory[] | { results: FinishingCategory[] }>('finishing-categories/')
    categories.value = Array.isArray(data) ? data : (data as { results: FinishingCategory[] }).results ?? []
  } catch { categories.value = [] }
}

async function load() {
  if (!selectedSlug.value) { loading.value = false; return }
  loading.value = true
  const api = useApi()
  try {
    const data = await api<FinishingRateWithCategory[] | { results: FinishingRateWithCategory[] }>(
      `shops/${selectedSlug.value}/finishing-rates/`
    )
    items.value = Array.isArray(data) ? data : (data as { results: FinishingRateWithCategory[] }).results ?? []
  } catch { items.value = [] }
  finally { loading.value = false }
}

watch(selectedSlug, () => load())

onMounted(async () => {
  if (!sellerStore.shops.length) await sellerStore.fetchShops()
  await loadCategories()
  if (sellerStore.shops.length) {
    selectedSlug.value = sellerStore.shops[0].slug
  } else {
    loading.value = false
  }
})
</script>
