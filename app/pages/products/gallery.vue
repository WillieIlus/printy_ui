<script setup lang="ts">
import type { GalleryProductDTO, GalleryCategoryDTO } from '~/shared/types/gallery'
import { getProductsGallery } from '~/shared/api/gallery'
import { formatKES } from '~/utils/formatters'

definePageMeta({ layout: 'default' })

const { getMediaUrl } = useApi()
const toast = useToast()

interface CategoryWithProducts {
  category: GalleryCategoryDTO
  products: GalleryProductDTO[]
}

const categories = ref<CategoryWithProducts[]>([])
const loading = ref(true)
const fetchError = ref<string | null>(null)
const categoryFilter = ref<string>('')

const tweakModalOpen = ref(false)
const tweakProduct = ref<GalleryProductDTO | null>(null)
const tweakCategory = ref<GalleryCategoryDTO | null>(null)

const allCategories = computed(() =>
  categories.value.map((c) => c.category)
)

const filteredProducts = computed(() => {
  if (!categoryFilter.value) {
    return categories.value.flatMap((c) =>
      c.products.map((p) => ({ product: p, category: c.category }))
    )
  }
  const cat = categories.value.find(
    (c) => c.category.slug === categoryFilter.value || c.category.name === categoryFilter.value
  )
  if (!cat) return []
  return cat.products.map((p) => ({ product: p, category: cat.category }))
})

function productImageUrl(product: GalleryProductDTO): string | null {
  const path = product.preview_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
}

function openTweak(product: GalleryProductDTO, category: GalleryCategoryDTO) {
  tweakProduct.value = product
  tweakCategory.value = category
  tweakModalOpen.value = true
}

function onTweakClose() {
  tweakProduct.value = null
  tweakCategory.value = null
}

async function fetchGallery() {
  loading.value = true
  fetchError.value = null
  try {
    const data = await getProductsGallery()
    categories.value = data.categories ?? []
  } catch {
    categories.value = []
    fetchError.value = 'Failed to load products'
  } finally {
    loading.value = false
  }
}

onMounted(fetchGallery)
</script>

<template>
  <div class="py-8 sm:py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl">
        Products Gallery
      </h1>
      <p class="mt-2 text-lg text-[var(--p-text-muted)]">
        Browse products by category. Click any product to customize and get a quote.
      </p>
    </div>

    <!-- Category filters -->
    <div v-if="allCategories.length" class="flex flex-wrap gap-2 mb-6">
      <UButton
        :variant="!categoryFilter ? 'solid' : 'outline'"
        :color="!categoryFilter ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="categoryFilter = ''"
      >
        All
      </UButton>
      <UButton
        v-for="cat in allCategories"
        :key="cat.slug"
        :variant="categoryFilter === cat.slug ? 'solid' : 'outline'"
        :color="categoryFilter === cat.slug ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="categoryFilter = cat.slug"
      >
        {{ cat.name }}
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading" />

    <CommonEmptyState
      v-else-if="fetchError || !filteredProducts.length"
      :title="fetchError ? 'Could not load products' : 'No products available yet'"
      :description="fetchError ? 'Something went wrong. Please try again later.' : 'Check back later for new products.'"
      icon="i-lucide-package"
    />

    <!-- Product grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="{ product, category } in filteredProducts"
        :key="product.id"
        class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all cursor-pointer"
        @click="openTweak(product, category)"
      >
        <!-- Preview image -->
        <div class="relative aspect-[4/3] bg-[var(--p-surface-sunken)] overflow-hidden">
          <NuxtImg
            v-if="productImageUrl(product)"
            :src="productImageUrl(product)!"
            :alt="product.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <UIcon name="i-lucide-package" class="h-16 w-16 text-[var(--p-border)]" />
          </div>
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <UBadge
              v-if="product.is_popular"
              variant="solid"
              color="primary"
              size="xs"
            >
              Popular
            </UBadge>
            <UBadge
              v-if="product.is_best_value"
              variant="solid"
              color="success"
              size="xs"
            >
              Best Value
            </UBadge>
            <UBadge
              v-if="product.is_new"
              variant="soft"
              color="primary"
              size="xs"
            >
              New
            </UBadge>
          </div>
          <!-- Shop label -->
          <div v-if="product.shop" class="absolute top-3 right-3">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-[var(--p-surface)]/90 backdrop-blur-sm border border-[var(--p-border)] px-3 py-1 text-xs font-medium text-[var(--p-text-dim)]"
            >
              <UIcon name="i-lucide-store" class="h-3 w-3" />
              {{ product.shop.name }}
            </span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors">
            {{ product.title }}
          </h3>
          <p v-if="category.name" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
            {{ category.name }}
          </p>

          <!-- Dimensions & weight -->
          <div class="mt-3 space-y-1.5">
            <div v-if="product.dimensions_label" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
              <UIcon name="i-lucide-ruler" class="h-3.5 w-3.5 shrink-0" />
              <span>{{ product.dimensions_label }}</span>
            </div>
            <div v-if="product.weight_label" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
              <UIcon name="i-lucide-scale" class="h-3.5 w-3.5 shrink-0" />
              <span>{{ product.weight_label }}</span>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between gap-2">
            <UButton
              color="primary"
              variant="soft"
              size="sm"
              @click.stop="openTweak(product, category)"
            >
              <UIcon name="i-lucide-sliders-horizontal" class="h-4 w-4 mr-1" />
              Tweak Quote
            </UButton>
          </div>
        </div>
      </article>
    </div>

    <!-- Tweak Quote Modal -->
    <GalleryTweakQuoteModal
      v-if="tweakProduct && tweakCategory"
      v-model:open="tweakModalOpen"
      :product="tweakProduct"
      :category="tweakCategory"
      @close="onTweakClose"
    />
  </div>
</template>
