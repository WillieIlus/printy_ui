<script setup lang="ts">
interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'We couldn\'t load this content. Please try again.',
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-red-200/80 bg-red-50/95 p-8 text-center dark:border-red-900/50 dark:bg-red-950/35"
  >
    <UIcon
      name="i-lucide-alert-circle"
      class="h-12 w-12 shrink-0 text-red-500 dark:text-red-400"
    />
    <h3 class="mt-4 text-lg font-semibold text-[var(--p-text)]">
      {{ title }}
    </h3>
    <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
      {{ message }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
