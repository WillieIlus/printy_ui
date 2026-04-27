<script setup lang="ts">
const colorMode = useColorMode()

const modes = [
  { value: 'light', icon: 'lucide:sun', label: 'Light' },
  { value: 'dark', icon: 'lucide:moon', label: 'Dark' },
]

function setMode(value: string) {
  colorMode.preference = value
}
</script>

<template>
  <div
    role="group"
    aria-label="Color theme"
    class="flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)]/50 p-1"
  >
    <button
      v-for="mode in modes"
      :key="mode.value"
      type="button"
      :title="`${mode.label} mode`"
      :aria-label="`${mode.label} mode`"
      :aria-pressed="colorMode.preference === mode.value"
      class="flex items-center justify-center rounded-full p-1 transition-all duration-200"
      :class="colorMode.preference === mode.value
        ? 'bg-[var(--p-bg)] text-[var(--p-primary)] shadow-sm ring-1 ring-[var(--p-border)]'
        : 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]'"
      @click="setMode(mode.value)"
    >
      <Icon :name="mode.icon" class="size-3.5 shrink-0" />
    </button>
  </div>
</template>
