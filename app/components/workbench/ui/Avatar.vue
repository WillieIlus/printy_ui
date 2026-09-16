<template>
  <div
    class="flex shrink-0 items-center justify-center rounded-full font-mono2 font-semibold"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${size * 0.32}px`,
      background: `hsla(${hue},60%,55%,.16)`,
      color: `hsl(${hue},72%,62%)`,
      boxShadow: `inset 0 0 0 1px hsla(${hue},60%,55%,.4)`,
    }"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ initials: string; hue: number; size?: number }>(), { size: 34 })
</script>