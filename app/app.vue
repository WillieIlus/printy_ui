<template>
  <UApp :toaster="toaster">
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
    <DevApiBaseIndicator />
  </UApp>
</template>

<script setup lang="ts">
import { getRouteLoadingCopy } from '~/composables/useRouteLoading'

const route = useRoute()

const toaster = {
  position: 'top-right' as const,
  expand: true,
  duration: 5000,
  max: 5,
  ui: {
    viewport: [
      'pointer-events-none fixed z-[110] flex flex-col gap-3 focus:outline-none',
      'left-4 right-4 top-[max(1rem,env(safe-area-inset-top))] w-auto max-w-[calc(100vw-2rem)]',
      'sm:left-auto sm:right-4 sm:w-96 sm:max-w-[min(24rem,calc(100vw-2rem))]',
    ].join(' '),
    base: 'pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) data-[expanded=false]:data-[front=false]:h-(--front-height) data-[expanded=false]:data-[front=false]:*:opacity-0 data-[front=false]:*:transition-opacity data-[front=false]:*:duration-100 data-[state=closed]:animate-[toast-closed_200ms_ease-in-out] data-[state=closed]:data-[expanded=false]:data-[front=false]:animate-[toast-collapsed-closed_200ms_ease-in-out] data-[swipe=move]:transition-none transition-[transform,translate,height] duration-200 ease-out top-0 data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out]',
  },
}

const initialLoadingCopy = computed(() => getRouteLoadingCopy(route.path))
</script>
