<template>
  <div class="pointer-events-none fixed inset-x-3 bottom-3 z-[160] flex flex-col gap-3 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-[max(1rem,env(safe-area-inset-top))] sm:w-[24rem]">
    <TransitionGroup name="printy-toast" tag="div" class="flex flex-col gap-3">
      <ToastItem
        v-for="toast in visibleToasts"
        :key="toast.id"
        :toast="toast"
        @dismiss="toastStore.dismiss(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()
const visibleToasts = computed(() => toastStore.toasts.slice(0, 4))
</script>

<style scoped>
.printy-toast-enter-active,
.printy-toast-leave-active,
.printy-toast-move {
  transition: transform 220ms ease, opacity 220ms ease;
}

.printy-toast-enter-from {
  opacity: 0;
  transform: translate3d(28px, 0, 0);
}

.printy-toast-leave-to {
  opacity: 0;
  transform: translate3d(16px, 0, 0);
}
</style>
