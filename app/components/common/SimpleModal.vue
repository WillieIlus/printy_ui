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
          class="modal-panel relative z-[70] flex max-h-[85dvh] w-full flex-col overflow-visible rounded-t-xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-lg sm:max-h-[90dvh] sm:max-w-lg sm:rounded-xl"
          @click.stop
        >
          <div class="flex items-center justify-between p-4 sm:px-6 border-b border-[var(--p-border)] shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-[var(--p-text)]">{{ title }}</h2>
              <p v-if="description" class="mt-0.5 text-sm text-[var(--p-text-muted)]">{{ description }}</p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
              aria-label="Close"
              @click="emit('update:open', false)"
            >
              <UIcon name="i-lucide-x" class="h-5 w-5" />
            </button>
          </div>
          <div class="relative z-[71] flex-1 overflow-y-auto p-4 sm:p-6">
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
