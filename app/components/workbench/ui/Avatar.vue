<template>
  <div
    class="flex shrink-0 items-center justify-center overflow-hidden rounded-full font-mono2 font-semibold"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${size * 0.32}px`,
      background: `hsla(${hue},60%,55%,.16)`,
      color: `hsl(${hue},72%,62%)`,
      boxShadow: `inset 0 0 0 1px hsla(${hue},60%,55%,.4)`,
    }"
  >
    <img v-if="src" :src="src" :alt="alt || (name ? `Avatar for ${name}` : 'Avatar')" class="h-full w-full object-cover" />
    <template v-else>{{ initials }}</template>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    initials: string
    hue?: number
    size?: number
    src?: string | null
    alt?: string
    name?: string
  }>(),
  { size: 34, hue: 160, src: null, alt: '', name: '' },
)
</script>
