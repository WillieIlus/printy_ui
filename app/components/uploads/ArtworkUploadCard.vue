<template>
  <UiCard class="space-y-4">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Artwork upload</p>
      <h3 class="mt-2 text-2xl font-black text-slate-950">Send proof or production files.</h3>
    </div>
    <label class="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <input class="hidden" type="file" @change="handleFile">
      <p class="text-sm font-semibold text-slate-900">Drag and drop is browser-native here. Tap to pick a file.</p>
      <p class="mt-2 text-xs text-slate-500">Only real backend uploads are allowed.</p>
    </label>
    <div v-if="fileName" class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
      Selected file: <span class="font-semibold text-slate-950">{{ fileName }}</span>
    </div>
    <div class="flex gap-3">
      <UiButton :loading="loading" @click="$emit('upload')">Upload file</UiButton>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/UiButton.vue'
import UiCard from '~/components/ui/UiCard.vue'

const emit = defineEmits<{
  select: [file: File | null]
  upload: []
}>()

defineProps<{
  loading?: boolean
  error?: string
}>()

const fileName = ref('')

function handleFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  fileName.value = file?.name || ''
  emit('select', file)
}
</script>
