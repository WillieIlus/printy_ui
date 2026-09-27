<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: string
    delay?: number
    distance?: number
    once?: boolean
  }>(),
  { as: 'div', delay: 0, distance: 16, once: true },
)

const el = useTemplateRef<Element>('el')
const revealed = ref(false)
const mounted = ref(false)
let observer: IntersectionObserver | null = null

const state = computed(() => (revealed.value || !mounted.value ? 'reveal-in' : 'reveal-wait'))

function reducedMotion(): boolean {
  return import.meta.client
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function stop() {
  observer?.disconnect()
  observer = null
}

onMounted(() => {
  if (reducedMotion() || !el.value || typeof IntersectionObserver === 'undefined') {
    revealed.value = true
    return
  }
  const rect = el.value.getBoundingClientRect()
  if (rect.top < window.innerHeight * 0.92) {
    revealed.value = true
    return
  }
  mounted.value = true
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        revealed.value = entry.isIntersecting
        if (entry.isIntersecting && props.once) {
          stop()
        }
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  )
  observer.observe(el.value)
})

onBeforeUnmount(stop)
</script>

<template>
  <component
    :is="as"
    ref="el"
    :class="['reveal', state]"
    :style="{ '--reveal-delay': `${delay}ms`, '--reveal-distance': `${distance}px` }"
  >
    <slot />
  </component>
</template>

<style scoped>
.reveal {
  transition:
    opacity 0.5s ease var(--reveal-delay, 0ms),
    transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) var(--reveal-delay, 0ms);
}

.reveal-wait {
  opacity: 0;
  transform: translateY(var(--reveal-distance, 16px));
}

.reveal-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal-wait,
  .reveal-in {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
