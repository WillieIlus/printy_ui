<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <div
          class="absolute inset-0 bg-black/55 backdrop-blur-sm"
          aria-hidden="true"
          @click="close"
        />

        <div
          class="modal-panel relative z-10 flex w-full flex-col overflow-hidden border border-[var(--p-border)] bg-[var(--p-surface)] shadow-2xl"
          :class="panelClasses"
          @click.stop
        >
          <div class="sticky top-0 z-10 border-b border-[var(--p-border)] bg-[var(--p-surface)]/96 px-4 py-4 backdrop-blur sm:px-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p v-if="eyebrow" class="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">
                  {{ eyebrow }}
                </p>
                <h2 class="mt-1 text-lg font-semibold text-[var(--p-text)] sm:text-xl">
                  {{ title }}
                </h2>
                <p v-if="description" class="mt-1 text-sm text-[var(--p-text-muted)]">
                  {{ description }}
                </p>
              </div>

              <button
                type="button"
                class="rounded-lg p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)]"
                aria-label="Close"
                @click="close"
              >
                <UIcon name="i-lucide-x" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <slot />
          </div>

          <div
            v-if="$slots.footer"
            class="border-t border-[var(--p-border)] bg-[var(--p-surface)]/98 px-4 py-4 backdrop-blur sm:px-6"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  title: string
  description?: string
  eyebrow?: string
  size?: 'md' | 'lg' | 'xl'
}>(), {
  description: '',
  eyebrow: '',
  size: 'lg',
})

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const panelClasses = computed(() => {
  if (props.size === 'md') {
    return 'max-h-[92dvh] rounded-t-[1.5rem] sm:max-h-[90dvh] sm:max-w-2xl sm:rounded-[1.75rem]'
  }
  if (props.size === 'xl') {
    return 'max-h-[96dvh] rounded-t-[1.5rem] sm:max-h-[94dvh] sm:max-w-5xl sm:rounded-[1.75rem]'
  }
  return 'max-h-[96dvh] rounded-t-[1.5rem] sm:max-h-[92dvh] sm:max-w-4xl sm:rounded-[1.75rem]'
})

function close() {
  emit('update:open', false)
}

watch(() => props.open, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
