<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="rgb(240 82 36)" :height="3" :throttle="0" />
    <Suspense>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <template #fallback>
        <CommonPageLoadingState
          variant="full"
          :title="initialLoadingCopy.title"
          :subtitle="initialLoadingCopy.subtitle"
          :show-shell="initialLoadingCopy.kind !== 'auth'"
        />
      </template>
    </Suspense>
    <CommonRouteLoadingOverlay />
    <ToastContainer />
    <DevApiBaseIndicator />
  </UApp>
</template>

<script setup lang="ts">
import { getRouteLoadingCopy } from '~/composables/useRouteLoading'

const route = useRoute()

const initialLoadingCopy = computed(() => getRouteLoadingCopy(route.path))
</script>
