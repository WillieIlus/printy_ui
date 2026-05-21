<template>
  <FileAttachmentList
    :title="title"
    :subtitle="subtitle"
    :badge="badge"
    badge-variant="orange"
    :files="files"
    :empty-text="emptyText"
  >
    <template #footer>
      <slot name="footer">
        <BaseAlert v-if="error" variant="error" :message="error" class="mb-3" />
        <label class="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">{{ uploadLabel }}</label>
        <div class="flex flex-col gap-3 sm:flex-row">
          <input ref="inputRef" type="file" class="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600" @change="onSelect" />
          <BaseButton variant="primary" size="md" :disabled="uploadDisabled || uploading" @click="$emit('upload')">
            {{ uploading ? uploadingLabel : actionLabel }}
          </BaseButton>
        </div>
        <p v-if="helpText" class="mt-2 text-xs text-slate-400">{{ helpText }}</p>
      </slot>
    </template>
  </FileAttachmentList>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import FileAttachmentList from '~/components/jobs/FileAttachmentList.vue'

const inputRef = ref<HTMLInputElement | null>(null)

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  badge?: string
  files: Array<{
    id: string | number
    name: string
    meta: string
    notes?: string
    badge: string
    badgeClass: string
    url?: string | null
  }>
  emptyText?: string
  error?: string
  uploading?: boolean
  uploadDisabled?: boolean
  uploadLabel?: string
  actionLabel?: string
  uploadingLabel?: string
  helpText?: string
}>(), {
  title: '',
  subtitle: '',
  badge: '',
  emptyText: 'No files available.',
  error: '',
  uploading: false,
  uploadDisabled: false,
  uploadLabel: 'Upload File',
  actionLabel: 'Upload',
  uploadingLabel: 'Uploading...',
  helpText: '',
})

const emit = defineEmits<{
  select: [event: Event]
  upload: []
}>()

function onSelect(event: Event) {
  emit('select', event)
}
</script>
