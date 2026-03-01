<template>
  <ClientOnly>
    <UDropdownMenu>
      <UButton
        variant="soft"
        color="neutral"
        size="sm"
        :icon="icon"
        aria-label="Change theme"
        class="rounded-xl"
      />
      <template #content>
        <UDropdownMenuItem
          v-for="opt in options"
          :key="opt.value"
          @click="set(opt.value)"
        >
          <template #leading>
            <UIcon
              :name="opt.icon"
              class="w-4 h-4"
              :class="pref === opt.value ? 'text-primary-600 dark:text-primary-400' : ''"
            />
          </template>
          <span :class="pref === opt.value ? 'font-semibold text-primary-600 dark:text-primary-400' : ''">
            {{ opt.label }}
          </span>
        </UDropdownMenuItem>
      </template>
    </UDropdownMenu>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

type Mode = 'light' | 'dark' | 'system'

const pref = computed<Mode>(() => (colorMode.preference || 'system') as Mode)

function set(mode: Mode) {
  colorMode.preference = mode
}

const icon = computed(() => {
  if (pref.value === 'dark') return 'i-lucide-moon'
  if (pref.value === 'light') return 'i-lucide-sun'
  return 'i-lucide-monitor'
})

const options: { value: Mode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'i-lucide-sun' },
  { value: 'dark', label: 'Dark', icon: 'i-lucide-moon' },
  { value: 'system', label: 'System', icon: 'i-lucide-monitor' },
]
</script>
