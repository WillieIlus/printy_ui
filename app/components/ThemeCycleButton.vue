<template>
  <ClientOnly>
    <UButton variant="ghost" color="gray" class="rounded-xl" :aria-label="`Theme: ${label}`" @click="cycle">
      <UIcon :name="icon" class="h-5 w-5" />
      <span class="ml-2 hidden sm:inline">{{ label }}</span>
    </UButton>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const order = ['light', 'dark', 'system'] as const
type Mode = (typeof order)[number]

const pref = computed<Mode>(() => (colorMode.preference || 'system') as Mode)

const cycle = () => {
  const idx = order.indexOf(pref.value)
  colorMode.preference = order[(idx + 1) % order.length]
}

const label = computed(() => {
  if (pref.value === 'dark') return 'Dark'
  if (pref.value === 'light') return 'Light'
  return 'System'
})

const icon = computed(() => {
  if (pref.value === 'dark') return 'i-lucide-moon'
  if (pref.value === 'light') return 'i-lucide-sun'
  return 'i-lucide-monitor'
})
</script>
