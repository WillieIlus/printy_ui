<template>
  <BasePage variant="public">
    <PublicHeader />
    <main>
      <slot />
    </main>
    <PublicFooter />
  </BasePage>
</template>

<script setup lang="ts">
import BasePage from '~/components/base/BasePage.vue'
import PublicFooter from '~/components/marketing/PublicFooter.vue'
import PublicHeader from '~/components/marketing/PublicHeader.vue'
</script>
