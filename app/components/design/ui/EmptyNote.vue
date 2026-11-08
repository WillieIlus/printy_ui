<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'

/**
 * Design empty state. The original title/hint API is unchanged; optional icon
 * and default-slot actions let design pages use it for richer empty states
 * without inventing a second primitive.
 */
const props = defineProps<{
  title: string
  hint?: string
  icon?: keyof typeof import('../../../utils/design/icon-registry').iconRegistry
}>()

const icon = computed(() => (props.icon ? getIcon(props.icon) : null))
</script>

<template>
  <div class="rounded-xl border border-dashed border-line-strong bg-paper px-5 py-8 text-center" data-design-empty>
    <component :is="icon" v-if="icon" :size="22" class="mx-auto text-ink-3" aria-hidden="true" />
    <p :class="['font-medium text-ink-2', icon ? 'mt-3' : '']">{{ props.title }}</p>
    <p v-if="props.hint" class="mt-1 text-sm text-ink-3">{{ props.hint }}</p>
    <div v-if="$slots.default" class="mt-4 flex flex-wrap items-center justify-center gap-2">
      <slot />
    </div>
  </div>
</template>
