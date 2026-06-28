<template>
  <form class="space-y-3" @submit.prevent="$emit('submit')">
    <UiTextarea v-model="draft" label="Reply" />
    <div class="flex flex-wrap gap-3">
      <UiButton type="submit" :loading="loading">Send reply</UiButton>
      <p v-if="attachmentUnsupported" class="text-xs text-slate-500">Attachments are not wired here until the thread endpoint confirms support.</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/UiButton.vue'
import UiTextarea from '~/components/ui/UiTextarea.vue'

const draft = defineModel<string>({ required: true })

defineProps<{
  loading?: boolean
  attachmentUnsupported?: boolean
}>()

defineEmits<{
  submit: []
}>()
</script>
