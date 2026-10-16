<template>
  <button
    type="button"
    class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]"
    :style="{ border: '1px solid var(--accent)' }"
    @click="goTrack"
  >
    <PackageSearch :size="13" style="color: var(--accent)" class="shrink-0" />
    Track job
  </button>
</template>

<script setup lang="ts">
import { PackageSearch } from 'lucide-vue-next'

function goTrack() {
  void navigateTo({ path: '/track' })
}
</script>
