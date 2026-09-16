<script setup lang="ts">
defineProps<{ title?: string; kicker?: string }>()
</script>

<template>
  <section class="mx-auto w-full max-w-[1180px] px-4 pt-12">
    <ML v-if="kicker">{{ kicker }}</ML>
    <h2 v-if="title" class="mt-2 font-disp text-[26px] font-bold tracking-tight sm:text-[30px]">{{ title }}</h2>
    <div :class="title || kicker ? 'mt-6' : ''"><slot /></div>
  </section>
</template>