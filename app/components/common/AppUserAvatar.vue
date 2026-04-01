<template>
  <div class="relative inline-flex shrink-0">
    <div
      :class="[sizeClass, 'inline-flex items-center justify-center overflow-hidden rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)]']"
    >
      <img
        v-if="resolvedSrc && !imageFailed"
        :src="resolvedSrc"
        :alt="alt"
        class="h-full w-full object-cover"
        @error="imageFailed = true"
      >
      <span
        v-else
        :class="[textClass, 'inline-flex h-full w-full items-center justify-center bg-[var(--color-primary-600)] font-bold text-white']"
      >
        {{ initials }}
      </span>
    </div>
    <CommonBadgeCount
      v-if="badgeCount && badgeCount > 0"
      :count="badgeCount"
      class="absolute -right-1.5 -top-1.5"
    />
  </div>
</template>

<script setup lang="ts">
import CommonBadgeCount from '~/components/common/BadgeCount.vue'
import { useMediaUrl } from '~/utils/media'

const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string
  initials?: string
  badgeCount?: number | null
  size?: 'sm' | 'md'
}>(), {
  src: null,
  alt: 'Avatar',
  initials: 'U',
  badgeCount: 0,
  size: 'md',
})

const getMediaUrl = useMediaUrl()
const imageFailed = ref(false)

const resolvedSrc = computed(() => getMediaUrl(props.src))

watch(() => props.src, () => {
  imageFailed.value = false
})

const sizeClass = computed(() => props.size === 'sm' ? 'h-8 w-8' : 'h-9 w-9')
const textClass = computed(() => props.size === 'sm' ? 'text-xs' : 'text-sm')
</script>
