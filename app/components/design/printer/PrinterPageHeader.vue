<script setup lang="ts">
import DesignWorkspacePageHeader from '../ui/WorkspacePageHeader.vue'

/**
 * Printer page heading. The layout lives in the shared workspace header so
 * every role gets the same kicker, title, copy and action placement.
 */
const props = withDefaults(defineProps<{
  index: string
  kicker: string
  title: string
  subtitle?: string
  description?: string
  class?: string
}>(), {
  subtitle: undefined,
  description: undefined,
  class: undefined,
})
</script>

<template>
  <DesignWorkspacePageHeader
    :index="props.index"
    :kicker="props.kicker"
    :title="props.title"
    :subtitle="props.subtitle"
    :description="props.description"
    :class="props.class"
  >
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
  </DesignWorkspacePageHeader>
</template>
