<script setup lang="ts">
/**
 * Legacy route: /gallery/[shopSlug]/[templateSlug]
 * Products use catalog (no slug-based product detail). Redirect to shop catalog.
 */
const route = useRoute()
const shopSlug = route.params.shopSlug as string

await navigateTo(`/gallery/${shopSlug}`, { replace: true })
</script>

<template>
  <div class="py-8 sm:py-12">
    <CommonLoadingSpinner />
  </div>
</template>
