<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="emit('update:open', false)"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden
          @click="emit('update:open', false)"
        />
        <div
          ref="slotRef"
          class="modal-panel relative z-[100010] flex max-h-[85dvh] w-full flex-col overflow-visible rounded-t-lg border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-lg sm:max-h-[90dvh] sm:max-w-lg sm:rounded-lg"
          @click.stop
        >
          <div class="flex shrink-0 items-center justify-between border-b border-[var(--p-border)] p-4 sm:px-6">
            <div>
              <h2 class="text-base font-semibold text-[var(--p-text)] sm:text-lg">{{ title }}</h2>
              <p v-if="description" class="mt-0.5 text-sm text-[var(--p-text-muted)]">{{ description }}</p>
            </div>
            <button
              type="button"
              class="rounded-md p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)]"
              aria-label="Close"
              @click="emit('update:open', false)"
            >
              <UIcon name="i-lucide-x" class="h-5 w-5" />
            </button>
          </div>
          <div class="relative z-[100011] flex-1 overflow-y-auto p-4 sm:p-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  description?: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const slotRef = ref<HTMLElement | null>(null)

watch(() => props.open, (open) => {
  if (open) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
