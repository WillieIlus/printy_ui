<template>
  <div class="rich-text-editor">
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-flamingo-500">*</span>
    </label>
    <div
      class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-flamingo-500/20 focus-within:border-flamingo-500"
      :class="{ 'border-red-300 dark:border-red-800': error }"
    >
      <div v-if="showToolbar" class="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <UButton
          type="button"
          variant="ghost"
          size="xs"
          :color="editor?.isActive('bold') ? 'primary' : 'neutral'"
          icon="i-lucide-bold"
          aria-label="Bold"
          @click="editor?.chain().focus().toggleBold().run()"
        />
        <UButton
          type="button"
          variant="ghost"
          size="xs"
          :color="editor?.isActive('italic') ? 'primary' : 'neutral'"
          icon="i-lucide-italic"
          aria-label="Italic"
          @click="editor?.chain().focus().toggleItalic().run()"
        />
        <UButton
          type="button"
          variant="ghost"
          size="xs"
          :color="editor?.isActive('bulletList') ? 'primary' : 'neutral'"
          icon="i-lucide-list"
          aria-label="Bullet list"
          @click="editor?.chain().focus().toggleBulletList().run()"
        />
        <UButton
          type="button"
          variant="ghost"
          size="xs"
          :color="editor?.isActive('orderedList') ? 'primary' : 'neutral'"
          icon="i-lucide-list-ordered"
          aria-label="Numbered list"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        />
      </div>
      <EditorContent :editor="editor" class="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[120px]" />
    </div>
    <p v-if="error" class="mt-1 flex items-center gap-1 text-xs text-red-500">
      <UIcon name="i-lucide-alert-circle" class="h-3.5 w-3.5 flex-shrink-0" />
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    required?: boolean
    showToolbar?: boolean
    error?: string
  }>(),
  { modelValue: '', showToolbar: true }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const id = `richtext-${Math.random().toString(36).slice(2)}`

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      blockquote: false,
    }),
    Placeholder.configure({
      placeholder: props.placeholder ?? 'Add notes...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[80px]',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val ?? '', false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
:deep(.tiptap) {
  outline: none;
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  color: #9ca3af;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.dark :deep(.tiptap p.is-editor-empty:first-child::before) {
  color: #6b7280;
}

:deep(.tiptap ul),
:deep(.tiptap ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.tiptap li) {
  margin: 0.25rem 0;
}
</style>
