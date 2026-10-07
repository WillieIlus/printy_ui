<script setup lang="ts">
import { resolveLegacyRoute } from '~/shared/legacy-redirect'

const route = useRoute()

const target = resolveLegacyRoute(route.path)

if (target) {
  await navigateTo(target, { redirectCode: 302 })
} else {
  throw createError({ statusCode: 404, message: 'Page not found', fatal: true })
}
</script>

<template>
  <div class="hidden" />
</template>