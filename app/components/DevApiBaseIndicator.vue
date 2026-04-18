<template>
  <div
    v-if="dev"
    class="fixed bottom-3 right-3 z-[9999] rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-2 py-1.5 text-xs font-mono text-amber-800 dark:text-amber-200 shadow-md"
    title="API base URL (dev only)"
  >
    API: {{ apiBase }}
  </div>
</template>

<script setup lang="ts">
import { getApiBase } from '~/shared/runtime-url'

const config = useRuntimeConfig()
const dev = import.meta.dev
const apiBase = getApiBase(config.public)
</script>
