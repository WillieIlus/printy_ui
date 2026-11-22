<script setup lang="ts">
import { computed } from 'vue'
import { ACTIVE_ROLE_EXPLANATION, activeRoleLabel, roleLabel } from '~/shared/vocabulary'

const props = defineProps<{
  role: string
}>()

const label = computed(() => activeRoleLabel(props.role))
const workspaceRole = computed(() => roleLabel(props.role))
</script>

<template>
  <div
    data-test="active-role-indicator"
    class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-brand/25 bg-mint/50 px-3.5 py-2.5"
  >
    <span class="rounded-full bg-brand px-2.5 py-1 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-white uppercase">
      {{ label }}
    </span>
    <span class="text-[12px] leading-relaxed text-brand-deep">
      {{ ACTIVE_ROLE_EXPLANATION }}
    </span>
    <span class="sr-only">{{ workspaceRole }} workspace</span>
  </div>
</template>
