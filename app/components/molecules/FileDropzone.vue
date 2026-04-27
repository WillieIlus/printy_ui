<!-- Purpose: File upload dropzone molecule with drag-and-drop support. -->
<template>
  <div
    :class="[
      'relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed p-6 text-center transition-colors',
      isDragging
        ? 'border-[var(--p-primary)] bg-[var(--p-primary-soft)]'
        : 'border-[var(--p-border)] bg-[var(--p-surface)] hover:border-[var(--p-primary-border)] hover:bg-[var(--p-bg-soft)]',
    ]"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="sr-only"
      @change="onChange"
    />
    <Icon name="lucide:upload" class="size-8 text-[var(--p-text-muted)]" />
    <div>
      <p class="text-sm font-medium text-[var(--p-text)]">
        <span class="text-[var(--p-primary)]">Click to upload</span>
        <span class="text-[var(--p-text-muted)]"> or drag and drop</span>
      </p>
      <p v-if="hint" class="mt-0.5 text-xs text-[var(--p-text-muted)]">{{ hint }}</p>
    </div>
    <ul v-if="files.length" class="mt-1 w-full space-y-1 text-left" @click.stop>
      <li
        v-for="f in files"
        :key="f.name"
        class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]"
      >
        <Icon name="lucide:file" class="size-3.5 shrink-0" />
        {{ f.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: File[]
  accept?: string
  multiple?: boolean
  hint?: string
}>(), {
  multiple: false,
  modelValue: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
  error: [message: string]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([...(props.modelValue ?? [])])

function onDrop(e: DragEvent) {
  isDragging.value = false
  updateFiles(Array.from(e.dataTransfer?.files ?? []))
}

function onChange(e: Event) {
  updateFiles(Array.from((e.target as HTMLInputElement).files ?? []))
}

function updateFiles(next: File[]) {
  files.value = props.multiple ? [...files.value, ...next] : next
  emit('update:modelValue', files.value)
}
</script>
