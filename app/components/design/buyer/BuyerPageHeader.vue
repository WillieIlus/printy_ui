<script setup lang="ts">
import DesignWorkspacePageHeader from '../ui/WorkspacePageHeader.vue'

/**
 * Buyer page heading. It uses the same shared workspace header as the manager
 * and printer dashboards, so the client workspace cannot drift into a
 * separate design.
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
