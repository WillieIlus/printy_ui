<template>
  <span>
    <template v-for="(seg, index) in segments" :key="index">
      <NuxtLink
        v-if="seg.link"
        :to="seg.link"
        class="underline decoration-dotted underline-offset-2 hover:opacity-80"
        :style="{ color: 'var(--accent)', fontWeight: seg.bold ? 700 : 500 }"
      >{{ seg.text }}</NuxtLink>
      <span v-else :style="seg.bold ? { fontWeight: 700, color: 'var(--ink)' } : undefined">{{ seg.text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import type { NotificationSegment } from '~/shared/types'

defineProps<{ segments: NotificationSegment[] }>()
</script>
