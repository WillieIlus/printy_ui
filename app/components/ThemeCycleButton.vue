<template>
  <ClientOnly>
    <UDropdownMenu
      :items="items"
      :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
      :ui="{
        content: 'min-w-52 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-1 shadow-xl backdrop-blur-xl',
        item: 'rounded-xl',
        itemLeadingIcon: 'text-[var(--p-text-muted)]',
        itemLabel: 'font-medium text-[var(--p-text)]',
        itemDescription: 'text-[var(--p-text-muted)]',
        itemTrailing: 'ml-auto',
      }"
    >
      <UButton
        color="neutral"
        variant="soft"
        size="sm"
        class="min-w-0 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] px-3 text-[var(--p-text)] shadow-sm hover:border-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)]"
        :aria-label="triggerAriaLabel"
      >
        <UIcon :name="currentOption.icon" class="h-4 w-4 shrink-0" />
        <span class="hidden sm:inline">{{ currentOption.label }}</span>
        <UIcon name="i-lucide-chevron-down" class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]" />
      </UButton>

      <template #item-leading="{ item }">
        <UIcon :name="item.icon" class="h-4 w-4" />
      </template>

      <template #item-label="{ item }">
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-[var(--p-text)]">
            {{ item.label }}
          </p>
          <p v-if="item.description" class="truncate text-xs text-[var(--p-text-muted)]">
            {{ item.description }}
          </p>
        </div>
      </template>

      <template #item-trailing="{ item }">
        <UIcon
          v-if="item.value === colorMode.preference"
          name="i-lucide-check"
          class="h-4 w-4 text-flamingo-500"
        />
      </template>
    </UDropdownMenu>

    <template #fallback>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-sm font-medium text-[var(--p-text)] shadow-sm"
        aria-label="Theme menu"
      >
        <UIcon name="i-lucide-monitor" class="h-4 w-4 shrink-0" />
        <span class="hidden sm:inline">Theme</span>
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
  description: string
}

const colorMode = useColorMode()

const options: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: 'i-lucide-sun-medium', description: 'Use the light theme.' },
  { value: 'dark', label: 'Dark', icon: 'i-lucide-moon-star', description: 'Use the dark theme.' },
  { value: 'system', label: 'System', icon: 'i-lucide-monitor', description: 'Match your device setting.' },
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

const items = computed(() => options.map(option => ({
  ...option,
  onSelect: () => {
    colorMode.preference = option.value
  },
})))
</script>
