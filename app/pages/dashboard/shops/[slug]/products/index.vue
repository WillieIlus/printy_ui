<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Products"
      subtitle="Catalog products available for quoting"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="soft" size="sm">Back</UButton>
        <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add product
        </UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="productStore.loading || !productStore.productsLoaded" variant="table" />

    <div v-else-if="productStore.products.length" class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Product</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Mode</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Published</th>
            <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Public</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border)]">
          <tr
            v-for="product in productStore.products"
            :key="product.id"
            :class="[
              'bg-[var(--p-surface)] transition-opacity',
              !isVisible(product) && 'opacity-60',
            ]"
          >
            <td class="px-4 py-4">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-[var(--p-text)]">{{ product.name }}</p>
                <UTooltip
                  v-if="!isVisible(product) && product.status === 'DRAFT'"
                  text="Click to publish"
                  :popper="{ placement: 'top' }"
                >
                  <button
                    type="button"
                    class="inline-flex"
                    :disabled="productStore.isToggleLoading(product.id, 'is_published')"
                    @click.stop="onToggle(product.id, 'is_published', true)"
                  >
                    <UBadge
                      color="neutral"
                      variant="soft"
                      size="xs"
                      class="cursor-pointer hover:ring-1 hover:ring-[var(--p-border)] transition-shadow"
                    >
                      Draft
                    </UBadge>
                  </button>
                </UTooltip>
                <UBadge
                  v-else-if="!isVisible(product)"
                  color="neutral"
                  variant="soft"
                  size="xs"
                >
                  {{ product.status === 'UNAVAILABLE' ? 'Unavailable' : 'Hidden' }}
                </UBadge>
              </div>
              <p v-if="product.description" class="mt-0.5 text-xs text-[var(--p-text-muted)] line-clamp-1">{{ product.description }}</p>
            </td>
            <td class="px-4 py-4">
              <UBadge color="neutral" variant="soft" size="sm">{{ modeLabel(product) }}</UBadge>
            </td>
            <td class="px-4 py-4 text-center">
              <div class="inline-flex flex-col items-center gap-1">
                <UToggle
                  :model-value="product.status === 'PUBLISHED'"
                  :loading="productStore.isToggleLoading(product.id, 'is_published')"
                  :disabled="productStore.isToggleLoading(product.id, 'is_published')"
                  @update:model-value="onToggle(product.id, 'is_published', $event)"
                />
                <span class="text-[0.65rem] text-[var(--p-text-muted)]">
                  {{ product.status === 'PUBLISHED' ? 'Published' : (product.status === 'UNAVAILABLE' ? 'Unavailable' : 'Draft') }}
                </span>
              </div>
            </td>
            <td class="px-4 py-4 text-center">
              <div class="inline-flex flex-col items-center gap-1">
                <UToggle
                  :model-value="product.is_public !== false"
                  :loading="productStore.isToggleLoading(product.id, 'is_public')"
                  :disabled="productStore.isToggleLoading(product.id, 'is_public')"
                  @update:model-value="onToggle(product.id, 'is_public', $event)"
                />
                <span class="text-[0.65rem] text-[var(--p-text-muted)]">
                  {{ product.is_public !== false ? 'Visible' : 'Hidden' }}
                </span>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="flex justify-end gap-2">
                <UButton :to="`/dashboard/shops/${slug}/products/${product.id}`" variant="soft" size="sm">View</UButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <DashboardEmptyState
      v-else
      title="No products yet"
      description="Add products to start quoting from your catalog."
      icon="i-lucide-package"
    >
      <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">Add first product</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/shared/types'
import { useProductStore } from '~/stores/product'
import { useShopStore } from '~/stores/shop'
import { useNotification } from '~/composables/useNotification'
import { isProductPublic } from '~/utils/product'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner', 'shop-setup-step'],
})

const route = useRoute()
const shopStore = useShopStore()
const productStore = useProductStore()
const notification = useNotification()
const slug = computed(() => route.params.slug as string)

function modeLabel(product: Product): string {
  if (product.pricing_mode === 'LARGE_FORMAT') return 'Large Format'
  if (product.product_kind === 'BOOKLET') return 'Booklet'
  return 'Sheet'
}

/** True when a product is fully visible to the public (published + public). */
const isVisible = isProductPublic

async function onToggle(id: number, field: 'is_published' | 'is_public', value: boolean) {
  const result = await productStore.toggleField(slug.value, id, field, value)
  if (!result.success) {
    notification.error(result.error ?? 'Could not update product.')
  }
}

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await productStore.fetchProducts(slug.value)
})
</script>
