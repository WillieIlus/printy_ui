<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
    <button
      type="button"
      :aria-expanded="open"
      :aria-label="`${open ? 'Collapse' : 'Expand'} ${title} section`"
      class="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      @click="open = !open"
    >
      <span class="font-semibold text-gray-900 dark:text-white">{{ title }}</span>
      <UIcon
        :name="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        class="w-5 h-5 text-gray-500"
      />
    </button>
    <div v-show="open" class="p-4 border-t border-gray-200 dark:border-gray-700">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    defaultOpen?: boolean
  }>(),
  { defaultOpen: true }
)

const open = ref(props.defaultOpen)
</script>
