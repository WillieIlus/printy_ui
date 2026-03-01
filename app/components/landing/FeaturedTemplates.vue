<template>
  <div class="space-y-4">
    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-pulse">
        <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
        <div class="p-5 space-y-3">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div class="flex gap-2">
            <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div class="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Cards grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="t in templates"
        :key="t.id"
        class="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all duration-300"
      >
        <div class="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <NuxtImg
            v-if="previewUrl(t)"
            :src="previewUrl(t)!"
            :alt="t.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center"
          >
            <UIcon name="i-lucide-file-image" class="h-16 w-16 text-gray-300 dark:text-gray-600" />
          </div>
          <div v-if="t.badges?.length" class="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <UBadge
              v-for="badge in t.badges.slice(0, 2)"
              :key="badge"
              size="xs"
              color="primary"
              variant="solid"
            >
              {{ badge }}
            </UBadge>
          </div>
        </div>
        <div class="p-5">
          <div class="flex items-center gap-2 mb-2">
            <span
              v-if="t.product_type"
              class="text-xs font-medium text-flamingo-600 dark:text-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/30 px-2 py-0.5 rounded-full"
            >
              {{ t.product_type }}
            </span>
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors">
            {{ t.title }}
          </h3>
          <p
            v-if="t.created_by_shop"
            class="text-xs text-gray-500 dark:text-gray-400 mb-2"
          >
            Provided by {{ t.created_by_shop.name }}
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <UBadge
              v-for="b in (t.badges ?? []).slice(2)"
              :key="b"
              size="xs"
              color="neutral"
              variant="soft"
            >
              {{ b }}
            </UBadge>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400">Starting from</span>
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {{ formatPrice(t) }}
              </div>
            </div>
            <div class="flex gap-2">
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                @click="openTweak(t)"
              >
                Tweak
              </UButton>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Browse all -->
    <div v-if="showBrowseAll" class="flex justify-center pt-4">
      <NuxtLink
        to="/gallery"
        class="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Browse all
        <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>

    <!-- Tweak modal -->
    <GalleryTemplateTweakerModal
      :open="tweakModalOpen"
      :template="selectedTemplate"
      @update:open="tweakModalOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import type { CatalogTemplate } from '~/shared/types'
import { formatKES } from '~/utils/formatters'
import { API } from '~/shared/api-paths'

const props = withDefaults(
  defineProps<{
    /** Max templates to show (default 6 for landing). 0 = no limit. */
    limit?: number
    /** Show "Browse all" link (hidden on gallery page) */
    showBrowseAll?: boolean
  }>(),
  { limit: 6, showBrowseAll: true }
)

const { get, getMediaUrl } = useApi()

const templates = ref<CatalogTemplate[]>([])
const loading = ref(true)
const tweakModalOpen = ref(false)
const selectedTemplate = ref<CatalogTemplate | null>(null)

const take = computed(() => (props.limit && props.limit > 0 ? props.limit : 999))

async function fetchFeatured() {
  loading.value = true
  try {
    const slice = (arr: CatalogTemplate[]) => arr.slice(0, take.value)

    // Try featured endpoint first
    const data = await get<CatalogTemplate[] | { results: CatalogTemplate[] }>(
      API.templatesFeatured()
    ).catch(() => null)

    if (data) {
      if (Array.isArray(data)) {
        templates.value = slice(data)
      } else if (data.results) {
        templates.value = slice(data.results)
      } else {
        templates.value = []
      }
      if (templates.value.length > 0) return
    }

    // Fallback: try popular
    const popular = await get<CatalogTemplate[] | { results: CatalogTemplate[] }>(
      API.templatesPopular()
    ).catch(() => null)

    if (popular) {
      const list = Array.isArray(popular) ? popular : popular.results ?? []
      templates.value = slice(list)
      if (templates.value.length > 0) return
    }

    // Fallback: GET /api/templates/?is_popular=true&ordering=base_price
    const fallback = await get<{ results: CatalogTemplate[] }>(
      API.templates(),
      { is_popular: 'true', ordering: 'base_price', limit: String(take.value) }
    ).catch(() => null)

    if (fallback?.results?.length) {
      templates.value = slice(fallback.results)
    } else {
      // Last resort: plain templates list
      const list = await get<{ results: CatalogTemplate[] } | CatalogTemplate[]>(
        API.templates(),
        { limit: String(take.value) }
      ).catch(() => null)
      if (list) {
        const arr = Array.isArray(list) ? list : list.results ?? []
        templates.value = slice(arr)
      }
    }
  } finally {
    loading.value = false
  }
}

function previewUrl(t: CatalogTemplate): string | null {
  if (!t.preview_image) return null
  if (t.preview_image.startsWith('http')) return t.preview_image
  return getMediaUrl(t.preview_image)
}

function formatPrice(t: CatalogTemplate): string {
  const p = t.starting_price ?? t.base_price
  if (p != null) return formatKES(p)
  return '—'
}

function openTweak(t: CatalogTemplate) {
  selectedTemplate.value = t
  tweakModalOpen.value = true
}

onMounted(fetchFeatured)
</script>
