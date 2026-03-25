<template>
  <div
    v-if="displayContent"
    class="prose prose-sm max-w-none text-[var(--p-text-dim)] prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-em:text-inherit prose-li:text-inherit prose-a:text-inherit prose-blockquote:text-inherit dark:prose-invert"
    :class="contentClass"
  >
    <!-- eslint-disable-next-line vue/no-v-html -- Content is sanitized with DOMPurify -->
    <div v-if="isHtml" v-html="sanitizedHtml" />
    <p v-else class="m-0">{{ html }}</p>
  </div>
  <slot v-else name="empty">
    <p v-if="showEmpty" class="text-sm italic text-[var(--p-text-muted)]">No content</p>
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
