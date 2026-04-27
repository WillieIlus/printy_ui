<!-- Purpose: WhatsApp contact CTA molecule. -->
<template>
  <a
    :href="waUrl"
    target="_blank"
    rel="noopener noreferrer"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] font-semibold text-white transition-colors hover:bg-[#1ebe5c]',
      sizes[size],
      block ? 'w-full' : '',
    ]"
  >
    <Icon name="simple-icons:whatsapp" class="size-4.5" />
    {{ label }}
  </a>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  phone: string
  message?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}>(), {
  label: 'Chat on WhatsApp',
  size: 'md',
})

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const waUrl = computed(() => {
  const base = `https://wa.me/${props.phone.replace(/\D/g, '')}`
  return props.message ? `${base}?text=${encodeURIComponent(props.message)}` : base
})
</script>
