<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="shouldShow"
      class="fixed inset-0 z-[120] bg-[color:color-mix(in_srgb,var(--p-bg)_74%,black_26%)]/88 backdrop-blur-md"
    >
      <CommonPageLoadingState
        variant="full"
        :title="loadingCopy.title"
        :subtitle="loadingCopy.subtitle"
        :show-shell="loadingCopy.kind !== 'auth'"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { getRouteLoadingCopy, isAuthSensitiveRoute, useRouteLoading } from '~/composables/useRouteLoading'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const routeLoading = useRouteLoading()

const bootLoadingVisible = computed(() =>
  import.meta.client
  && authStore.initializing
  && isAuthSensitiveRoute(route.path)
)

const shouldShow = computed(() => routeLoading.visible.value || bootLoadingVisible.value)

const loadingCopy = computed(() => {
  const path = routeLoading.targetPath.value ?? route.path
  return getRouteLoadingCopy(path)
})
</script>
