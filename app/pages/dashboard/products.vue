<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">Products</h1>
        <p class="text-sm text-[var(--p-text-muted)]">Manage your product catalog. Publish products when pricing is ready.</p>
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

    <!-- Pricing warning -->
    <div v-if="setupStatus && !setupStatus.has_pricing && sellerStore.shops.length" class="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 flex items-start gap-3">
      <UIcon name="i-lucide-alert-triangle" class="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div class="min-w-0">
        <p class="text-sm font-medium text-amber-800 dark:text-amber-200">Pricing not set up</p>
        <p class="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Products will be saved as Draft until you add pricing. Buyers won't see Draft products.</p>
        <UButton color="primary" variant="soft" size="xs" class="mt-2" to="/dashboard/pricing">
          Go to Pricing
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
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Min qty</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="p in items" :key="p.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-[var(--p-text)]">{{ p.name }}</div>
              <div v-if="p.category" class="text-xs text-[var(--p-text-muted)]">{{ p.category }}</div>
              <div v-if="p.publish_block_reason" class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{{ p.publish_block_reason }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ p.pricing_mode }}</td>
            <td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">{{ p.min_quantity ?? 100 }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="statusColor(p.status)" variant="soft" size="xs">{{ p.status ?? 'DRAFT' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right space-x-1">
              <UButton
                v-if="p.status !== 'PUBLISHED' && p.can_publish"
                variant="soft"
                size="xs"
                color="success"
                :loading="publishingId === p.id"
                @click="publishProduct(p)"
              >
                Publish
              </UButton>
              <UButton
                v-else-if="p.status !== 'PUBLISHED' && !p.can_publish"
                variant="soft"
                size="xs"
                color="neutral"
                disabled
                title="Add pricing to publish products"
              >
                Publish
              </UButton>
              <UButton variant="soft" size="xs" :to="`/dashboard/shops/${selectedSlug}/setup`">Edit</UButton>
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
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useApi } from '~/shared/api'
import { API } from '~/shared/api-paths'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

interface ProductItem {
  id: number
  name: string
  category?: string
  pricing_mode: string
  min_quantity?: number
  status?: string
  can_publish?: boolean
  publish_block_reason?: string
  is_active: boolean
  finishing_options?: unknown[]
}

const sellerStore = useSellerStore()
const { status: setupStatus, refresh: refreshSetup } = useSetupStatus()
const toast = useToast()
const rawApi = useApi()

const items = ref<ProductItem[]>([])
const loading = ref(true)
const publishingId = ref<number | null>(null)

const selectedSlug = ref('')
const shopOptions = computed(() =>
  sellerStore.shops.map(s => ({ value: s.slug, label: s.name }))
)

function statusColor(status?: string) {
  if (status === 'PUBLISHED') return 'success'
  if (status === 'UNAVAILABLE') return 'error'
  return 'neutral'
}

function goToAddProduct() {
  if (selectedSlug.value) {
    navigateTo(`/dashboard/shops/${selectedSlug.value}/setup`)
  }
}

async function publishProduct(product: ProductItem) {
  publishingId.value = product.id
  try {
    await rawApi(API.shopProductDetail(selectedSlug.value, product.id), {
      method: 'PATCH',
      body: { status: 'PUBLISHED' },
    })
    toast.add({ title: 'Published', description: `${product.name} is now visible to buyers.`, color: 'success' })
    await load()
    await refreshSetup()
  } catch (err) {
    toast.add({ title: 'Cannot publish', description: err instanceof Error ? err.message : 'Failed to publish', color: 'error' })
  } finally {
    publishingId.value = null
  }
}

async function load() {
  if (!selectedSlug.value) { loading.value = false; return }
  loading.value = true
  try {
    const data = await rawApi<ProductItem[] | { results: ProductItem[] }>(API.shopProducts(selectedSlug.value))
    items.value = Array.isArray(data) ? data : (data as { results: ProductItem[] }).results ?? []
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
