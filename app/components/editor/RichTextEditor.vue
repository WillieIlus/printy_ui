<template>
  <ClientOnly>
    <div class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden focus-within:border-flamingo-500 focus-within:ring-2 focus-within:ring-flamingo-500/20 transition-all">
    <!-- Toolbar -->
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80 px-3 py-2"
    >
      <button
        type="button"
        :class="[
          'rounded p-1.5 transition-colors',
          editor.isActive('bold') ? 'bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        title="Bold"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <UIcon name="i-lucide-bold" class="h-4 w-4" />
      </button>
      <button
        type="button"
        :class="[
          'rounded p-1.5 transition-colors',
          editor.isActive('italic') ? 'bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        title="Italic"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <UIcon name="i-lucide-italic" class="h-4 w-4" />
      </button>
      <span class="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600" />
      <button
        type="button"
        :class="[
          'rounded p-1.5 transition-colors',
          editor.isActive('heading', { level: 2 }) ? 'bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        title="Heading"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <UIcon name="i-lucide-heading-2" class="h-4 w-4" />
      </button>
      <span class="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600" />
      <button
        type="button"
        :class="[
          'rounded p-1.5 transition-colors',
          editor.isActive('bulletList') ? 'bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        title="Bullet list"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <UIcon name="i-lucide-list" class="h-4 w-4" />
      </button>
      <button
        type="button"
        :class="[
          'rounded p-1.5 transition-colors',
          editor.isActive('orderedList') ? 'bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        title="Ordered list"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <UIcon name="i-lucide-list-ordered" class="h-4 w-4" />
      </button>
    </div>
    <!-- Editor content -->
    <div class="min-h-[120px] px-4 py-3">
      <EditorContent :editor="editor" class="prose prose-sm dark:prose-invert max-w-none min-h-[80px]" />
    </div>
  </div>
  <template #fallback>
    <div class="w-full min-h-[120px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
      <div class="min-h-[80px] text-gray-400 dark:text-gray-500 text-sm">
        {{ placeholder || 'Loading editor...' }}
      </div>
    </div>
  </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { modelValue: '', placeholder: '' }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = useEditor({
  content: props.modelValue || '',
  editable: !props.disabled,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[80px]',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Sync modelValue changes into editor (e.g. when form resets)
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== (val || '')) {
      editor.value.commands.setContent(val || '', false)
    }
  }
)

// Sync disabled state
watch(
  () => props.disabled,
  (val) => {
    editor.value?.setEditable(!val)
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
:deep(.tiptap) {
  outline: none;
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  color: rgb(156 163 175);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.dark :deep(.tiptap p.is-editor-empty:first-child::before) {
  color: rgb(107 114 128);
}
</style>
