<!-- Purpose: Single toast notification molecule with icon, message, and optional dismiss. -->
<template>
  <div
    role="alert"
    :class="[
      'z-[120] flex items-start gap-3 rounded-[var(--radius-md)] border p-3.5 shadow-[var(--shadow-md)]',
      styles[type].wrapper,
    ]"
  >
    <Icon :name="styles[type].icon" :class="['mt-0.5 size-5 shrink-0', styles[type].iconClass]" />
    <div class="min-w-0 flex-1">
      <p v-if="title" :class="['text-sm font-semibold', styles[type].title]">{{ title }}</p>
      <p :class="['text-sm', styles[type].body]">{{ message }}</p>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="shrink-0 rounded-md p-1 transition-colors"
      :aria-label="'Dismiss'"
      @click="$emit('close')"
    >
      <Icon name="lucide:x" class="size-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  dismissible?: boolean
}>(), {
  type: 'info',
  dismissible: true,
})

defineEmits<{ close: [] }>()

const styles = {
  success: {
    wrapper: 'border-transparent bg-[var(--p-success)] text-white',
    icon:      'lucide:check-circle-2',
    iconClass: 'text-white',
    title: 'text-white',
    body: 'text-white/90',
  },
  error: {
    wrapper: 'border-transparent bg-[var(--p-error)] text-white',
    icon:      'lucide:x-circle',
    iconClass: 'text-white',
    title: 'text-white',
    body: 'text-white/90',
  },
  warning: {
    wrapper: 'border-transparent bg-[var(--p-warning)] text-white',
    icon:      'lucide:triangle-alert',
    iconClass: 'text-white',
    title: 'text-white',
    body: 'text-white/90',
  },
  info: {
    wrapper: 'border-transparent bg-[var(--p-secondary)] text-white',
    icon:      'lucide:info',
    iconClass: 'text-white',
    title: 'text-white',
    body: 'text-white/90',
  },
} as const
</script>
