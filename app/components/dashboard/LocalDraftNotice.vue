<template>
  <div
    class="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100 sm:flex-row sm:items-start sm:justify-between"
  >
    <div class="space-y-1">
      <p class="font-semibold">{{ title }}</p>
      <p class="leading-6 text-amber-900/80 dark:text-amber-100/85">
        {{ description }}
      </p>
    </div>
    <UButton
      v-if="showClear"
      variant="ghost"
      color="warning"
      size="sm"
      class="shrink-0"
      @click="$emit('clear')"
    >
      Discard Draft
    </UButton>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  entityLabel?: string
  showClear?: boolean
}>(), {
  entityLabel: 'changes',
  showClear: false,
})

defineEmits<{
  clear: []
}>()

const title = computed(() => `Local ${props.entityLabel} draft`)
const description = computed(() => `This draft is stored only on this device. Nothing is saved to your shop until you click Save.`)
</script>
