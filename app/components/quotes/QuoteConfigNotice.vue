<template>
  <div class="rounded-xl border p-4" :class="toneClasses">
    <div class="flex items-start gap-3">
      <div class="mt-0.5 rounded-full p-1.5" :class="iconToneClasses">
        <UIcon :name="iconName" class="h-4 w-4" />
      </div>
      <div class="min-w-0 flex-1">
        <p v-if="title" class="font-semibold">{{ title }}</p>
        <p v-if="message" class="mt-1 text-sm leading-6">{{ message }}</p>
        <div v-if="$slots.default" class="mt-3">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string
}>(), {
  tone: 'info',
  title: '',
  message: '',
})

const toneClasses = computed(() => {
  if (props.tone === 'success') return 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200'
  if (props.tone === 'warning') return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200'
  if (props.tone === 'error') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200'
  return 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-200'
})

const iconToneClasses = computed(() => {
  if (props.tone === 'success') return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
  if (props.tone === 'warning') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200'
  if (props.tone === 'error') return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
  return 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200'
})

const iconName = computed(() => {
  if (props.tone === 'success') return 'i-lucide-check'
  if (props.tone === 'warning') return 'i-lucide-lightbulb'
  if (props.tone === 'error') return 'i-lucide-alert-triangle'
  return 'i-lucide-info'
})
</script>
