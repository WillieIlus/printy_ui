<template>
  <div
    v-if="displayContent"
    class="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
    :class="contentClass"
  >
    <!-- eslint-disable-next-line vue/no-v-html -- Content is sanitized with DOMPurify -->
    <div v-if="isHtml" v-html="sanitizedHtml" />
    <p v-else class="m-0">{{ html }}</p>
  </div>
  <slot v-else name="empty">
    <p v-if="showEmpty" class="text-sm text-gray-500 dark:text-gray-500 italic">No content</p>
  </slot>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'

const props = withDefaults(
  defineProps<{
    html?: string | null
    contentClass?: string
    showEmpty?: boolean
  }>(),
  { html: undefined, contentClass: '', showEmpty: false }
)

const displayContent = computed(() => !!props.html?.trim())
const isHtml = computed(() => /<[a-z][\s\S]*>/i.test(props.html ?? ''))

const sanitizedHtml = computed(() => {
  if (!props.html?.trim() || !isHtml.value) return ''
  if (typeof window === 'undefined') return props.html
  return DOMPurify.sanitize(props.html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
})
</script>
