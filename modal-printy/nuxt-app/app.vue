<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toastMessage"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium shadow-2xl">
            <svg class="h-5 w-5 text-green-400 dark:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ toastMessage }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const toastMessage = useState<string>('toast', () => '')

watch(toastMessage, (msg) => {
  if (msg) {
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }
})
</script>
