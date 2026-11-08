<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator :color="loadingColour" :height="3" :throttle="0" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { BRAND_COLOURS } from '~/shared/brand'

const loadingColour = BRAND_COLOURS.orange
</script>
