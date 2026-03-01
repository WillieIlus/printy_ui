<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  categories,
  templates,
  getCategoryByKey,
  type DemoTemplate,
} from '~/shared/demoTemplates'
import { demoRateCard } from '~/shared/demoRateCard'
import { computeDemoQuote, type DemoFormState } from '~/shared/demoPricing'
import { formatKES } from '~/utils/formatters'

const searchQuery = ref('')
const selectedCategory = ref('all')

const filteredTemplates = computed(() => {
  let list = selectedCategory.value === 'all'
    ? templates
    : templates.filter((t) => t.category === selectedCategory.value)

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (getCategoryByKey(t.category)?.label ?? '').toLowerCase().includes(q)
    )
  }
  return list
})

function getDemoPrice(template: DemoTemplate): number {
  const formState: DemoFormState = {
    unit: template.unit,
    sheetSize: template.sheetSize,
    piecesPerSheet: template.piecesPerSheet,
    sides: template.defaultSides,
    quantity: template.defaultQty,
    materialKey: template.defaultMaterial,
    finishingIds: template.defaultFinishings,
    widthM: template.defaultWidthM ?? 1,
    heightM: template.defaultHeightM ?? 1,
  }
  const result = computeDemoQuote(formState, demoRateCard)
  return result.total
}

const emit = defineEmits<{
  (e: 'tweak', template: DemoTemplate): void
}>()

function onTweak(template: DemoTemplate) {
  emit('tweak', template)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Category pills -->
    <div class="flex flex-wrap gap-2">
      <UButton
        :variant="selectedCategory === 'all' ? 'solid' : 'outline'"
        :color="selectedCategory === 'all' ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="selectedCategory = 'all'"
      >
        All
      </UButton>
      <UButton
        v-for="cat in categories"
        :key="cat.key"
        :variant="selectedCategory === cat.key ? 'solid' : 'outline'"
        :color="selectedCategory === cat.key ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="selectedCategory = cat.key"
      >
        <UIcon :name="cat.icon" class="mr-1.5 h-4 w-4" />
        {{ cat.label }}
      </UButton>
    </div>

    <!-- Search -->
    <UInput
      v-model="searchQuery"
      placeholder="Search by template name or description..."
      icon="i-lucide-search"
      size="lg"
      class="w-full"
    />

    <!-- Empty state -->
    <CommonEmptyState
      v-if="filteredTemplates.length === 0"
      title="No templates found"
      description="Try a different search or category."
      icon="i-lucide-search-x"
    />

    <!-- Grid of cards -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                {{ template.name }}
              </h3>
              <UBadge
                v-if="template.badge"
                color="primary"
                variant="soft"
                size="xs"
              >
                {{ template.badge }}
              </UBadge>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ template.description }}
            </p>
            <p class="mt-2 text-xs font-medium text-gray-400 dark:text-gray-500">
              {{ getCategoryByKey(template.category)?.label ?? template.category }}
            </p>
            <p
              v-if="template.created_by_shop"
              class="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              Provided by {{ template.created_by_shop.name }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">From</span>
          <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
            {{ formatKES(getDemoPrice(template)) }}
          </span>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-2">
          <UButton
            color="primary"
            block
            class="rounded-xl"
            @click="onTweak(template)"
          >
            <UIcon name="i-lucide-sliders-horizontal" class="mr-2 h-4 w-4" />
            Tweak
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
