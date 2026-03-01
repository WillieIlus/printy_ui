<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="preset in templatePresets"
        :key="preset.id"
        type="button"
        class="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 text-left shadow-sm hover:shadow-md hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all"
        @click="selectPreset(preset)"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <UIcon :name="iconForPreset(preset.id)" class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ preset.name }}
          </h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ preset.unit }} • {{ preset.sides === 2 ? 'Double-sided' : 'Single-sided' }} •
          {{ preset.quantity }} {{ preset.unit === 'SQM' ? 'm²' : 'pcs' }}
          {{ preset.material }}
        </p>
        <p v-if="preset.finishing.length" class="mt-2 text-xs text-gray-500 dark:text-gray-500">
          + {{ preset.finishing.join(', ') }}
        </p>
        <span class="mt-4 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
          Use in simulator →
        </span>
      </button>
    </div>

    <div class="text-center">
      <NuxtLink
        to="/auth/login"
        class="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-700 shadow-md shadow-primary-200 dark:shadow-primary-900/50 transition-all"
      >
        Sign in to access gallery
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { templatePresets, type DemoPreset } from '~/shared/demoRateCard'

const emit = defineEmits<{
  (e: 'select', preset: DemoPreset): void
}>()

function selectPreset(preset: DemoPreset) {
  emit('select', preset)
}

function iconForPreset(id: string): string {
  const icons: Record<string, string> = {
    'business-cards': 'i-lucide-credit-card',
    'a5-flyers': 'i-lucide-file-text',
    posters: 'i-lucide-image',
    stickers: 'i-lucide-sticker',
    banners: 'i-lucide-panel-top',
    invitations: 'i-lucide-mail',
  }
  return icons[id] ?? 'i-lucide-file'
}
</script>
