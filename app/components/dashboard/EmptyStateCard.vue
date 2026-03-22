<template>
  <div class="rounded-[28px] border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center backdrop-blur-xl">
    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
      <UIcon :name="icon" class="h-7 w-7 text-orange-300" />
    </div>
    <h3 class="mt-4 text-lg font-semibold text-white">{{ title }}</h3>
    <p v-if="description" class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
}>(), {
  icon: 'i-lucide-sparkles',
})
</script>
