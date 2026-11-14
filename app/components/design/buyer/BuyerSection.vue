<script setup lang="ts">
import DesignWorkspaceSection from '../ui/WorkspaceSection.vue'

/**
 * Buyer section frame. The layout lives in the shared workspace section so
 * every dashboard role renders the same section heading and rhythm.
 */
const props = defineProps<{
  id?: string
  index: string
  title: string
  hint?: string
  class?: string
}>()
</script>

<template>
  <DesignWorkspaceSection
    :id="props.id"
    :index="props.index"
    :title="props.title"
    :hint="props.hint"
    :class="props.class"
  >
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
    <slot />
  </DesignWorkspaceSection>
</template>
