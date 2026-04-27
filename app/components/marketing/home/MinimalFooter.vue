<!-- Purpose: Minimal footer for public-facing pages. -->
<template>
  <footer class="border-t border-[var(--p-border)] px-4 py-10 md:px-6">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[var(--p-text-muted)] md:flex-row md:items-center md:justify-between">
      <p>Printy connects clients to print shops with backend-driven job previews.</p>
      <div class="flex items-center gap-4">
        <NuxtLink to="/shops" class="hover:text-[var(--p-text)]">Shops</NuxtLink>
        <NuxtLink to="/products" class="hover:text-[var(--p-text)]">Products</NuxtLink>
        <NuxtLink to="/auth/login" class="hover:text-[var(--p-text)]">Login</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
