<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <button
      v-for="t in templates"
      :key="t.templateName"
      type="button"
      class="group rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary-500/50"
      @click="emit('select', t.preset)"
    >
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-105 transition-transform">
        <UIcon :name="t.icon" class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ t.templateName }}</h3>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ t.description }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SimulatorPreset } from '~/shared/demo/demo-rate-card'

interface TemplateDef {
  templateName: string
  description: string
  icon: string
  preset: SimulatorPreset
}

const templates: TemplateDef[] = [
  {
    templateName: 'Business Cards',
    description: 'A5 • 2-sided • 350 gsm',
    icon: 'i-lucide-credit-card',
    preset: {
      templateName: 'Business Cards',
      unit: 'A5',
      sides: 2,
      quantity: 500,
      gsm: 350,
      finishing: { rounding: true },
    },
  },
  {
    templateName: 'Flyers',
    description: 'A5 • 2-sided • 150 gsm',
    icon: 'i-lucide-file-text',
    preset: {
      templateName: 'Flyers',
      unit: 'A5',
      sides: 2,
      quantity: 1000,
      gsm: 150,
      finishing: {},
    },
  },
  {
    templateName: 'Posters',
    description: 'A3 • 1-sided • 300 gsm',
    icon: 'i-lucide-image',
    preset: {
      templateName: 'Posters',
      unit: 'A3',
      sides: 1,
      quantity: 100,
      gsm: 300,
      finishing: { lamination: true },
    },
  },
  {
    templateName: 'Stickers',
    description: 'A4 • 1-sided • 350 gsm',
    icon: 'i-lucide-tag',
    preset: {
      templateName: 'Stickers',
      unit: 'A4',
      sides: 1,
      quantity: 250,
      gsm: 350,
      finishing: { rounding: true },
    },
  },
  {
    templateName: 'Banners',
    description: 'SQM • Vinyl • 1×2 m',
    icon: 'i-lucide-panel-top',
    preset: {
      templateName: 'Banners',
      unit: 'SQM',
      quantity: 1,
      material: 'vinyl',
      widthM: 1,
      heightM: 2,
      finishing: {},
    },
  },
  {
    templateName: 'Invitations',
    description: 'A5 • 2-sided • Folding',
    icon: 'i-lucide-mail',
    preset: {
      templateName: 'Invitations',
      unit: 'A5',
      sides: 2,
      quantity: 200,
      gsm: 300,
      finishing: { folding: true },
    },
  },
]

const emit = defineEmits<{ select: [preset: SimulatorPreset] }>()
</script>
