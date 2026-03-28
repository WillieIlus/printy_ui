<template>
  <ClientOnly>
    <UButton
      color="neutral"
      variant="soft"
      size="sm"
      class="min-w-0 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] px-2.5 text-[var(--p-text)] shadow-sm hover:border-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)]"
      :aria-label="triggerAriaLabel"
      @click="cycleTheme"
    >
      <UIcon :name="currentOption.icon" class="h-4 w-4 shrink-0" />
      <span class="hidden sm:inline">{{ currentOption.label }}</span>
    </UButton>

    <template #fallback>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] px-2.5 py-2 text-sm font-medium text-[var(--p-text)] shadow-sm"
        aria-label="Cycle theme"
      >
        <UIcon name="i-lucide-monitor" class="h-4 w-4 shrink-0" />
        <span class="hidden sm:inline">System</span>
      </button>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
type ThemePreference = 'light' | 'dark' | 'system'

interface ThemeOption {
  value: ThemePreference
  label: string
  icon: string
}

const colorMode = useColorMode()

const options: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: 'i-lucide-sun-medium' },
  { value: 'dark', label: 'Dark', icon: 'i-lucide-moon-star' },
  { value: 'system', label: 'System', icon: 'i-lucide-monitor' },
]

const resolvedLabel = computed(() => colorMode.value === 'dark' ? 'Dark' : 'Light')

const currentOption = computed(() => {
  return options.find(option => option.value === colorMode.preference) ?? options[2]
})

const triggerAriaLabel = computed(() => {
  if (colorMode.preference === 'system') {
    return `Theme: System. Currently following ${resolvedLabel.value} mode.`
  }

  return `Theme: ${currentOption.value.label}.`
})

function cycleTheme() {
  const currentIndex = options.findIndex(option => option.value === colorMode.preference)
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0
  colorMode.preference = options[nextIndex].value
}
</script>
