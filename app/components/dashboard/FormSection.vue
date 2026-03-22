<template>
  <section class="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
    <div v-if="title || description || $slots.header" class="mb-5 flex items-start justify-between gap-4">
      <slot name="header">
        <div class="space-y-1">
          <h2 v-if="title" class="text-lg font-semibold text-white">
            {{ title }}
          </h2>
          <p v-if="description" class="max-w-2xl text-sm text-slate-300">
            {{ description }}
          </p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <div class="space-y-5">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>
