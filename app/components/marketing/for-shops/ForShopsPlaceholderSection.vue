<!-- Purpose: Shared placeholder block for future /for-shops landing sections. -->
<template>
  <section :id="id" class="rounded-[1.75rem] border border-dashed border-[#f2d3c8] bg-white/90 px-6 py-8 md:px-8 md:py-10">
    <div v-if="anchorId" :id="anchorId" class="scroll-mt-32" />
    <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#e13515]">{{ title }}</p>
        <h2 class="font-[Montserrat] text-2xl font-semibold tracking-[-0.03em] text-[#101828]">{{ title }} placeholder</h2>
      </div>
      <span class="inline-flex w-fit rounded-full border border-[#f3d2cb] bg-[#fff7f5] px-3 py-1 text-xs font-medium text-[#667085]">
        Ready for future component extraction
      </span>
    </div>
    <p class="mt-4 max-w-3xl text-sm leading-7 text-[#667085] md:text-base">{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  title: string
  description: string
  anchorId?: string
}>()
</script>
