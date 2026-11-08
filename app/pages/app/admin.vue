<script setup lang="ts">
import DesignAdminFrame from '~/components/design/admin/AdminFrame.vue'

definePageMeta({ layout: 'design-workspace', middleware: 'proto-role' })
</script>

<template>
  <DesignAdminFrame>
    <NuxtPage />
  </DesignAdminFrame>
</template>
