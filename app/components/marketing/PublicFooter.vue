<template>
  <footer class="bg-[#101828] border-t border-[#1d2939] py-8">
    <div class="max-w-7xl mx-auto px-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <PrintyLogo variant="light" size="md" to="/" />

      <div class="flex flex-wrap items-center gap-4 text-sm">
        <NuxtLink to="/auth/register" class="text-[#98a2b3] hover:text-white transition-colors">Client signup</NuxtLink>
        <NuxtLink to="/auth/register?role=partner" class="text-[#98a2b3] hover:text-white transition-colors">Partner signup</NuxtLink>
        <NuxtLink to="/auth/register?role=production" class="text-[#98a2b3] hover:text-white transition-colors">Production signup</NuxtLink>
      </div>

      <p class="text-xs text-[#667085]">&copy; {{ currentYear }} Printy. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import PrintyLogo from '~/components/printy/PrintyLogo.vue'

const currentYear = new Date().getFullYear()
</script>
