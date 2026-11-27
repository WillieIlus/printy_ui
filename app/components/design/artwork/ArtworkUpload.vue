<script setup lang="ts">
/**
 * Artwork upload, ported from the prototype's upload panel.
 *
 * One shared presentation for the buyer request detail, the composed order
 * detail and the job timeline: dashed dropzone, chosen-file row, "my manager
 * already has it" option and one submit action. Parents keep the real upload
 * and validation; this component only owns selection and busy presentation.
 */
import { ref } from 'vue'
import { Loader2, Upload } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  fileName?: string | null
  busy?: boolean
  disabled?: boolean
  managerHold?: boolean
  showManagerHold?: boolean
  managerHoldLabel?: string
  submitLabel?: string
  hint?: string
  error?: string
  notice?: string
  inputTest?: string
  pickTest?: string
  uploadTest?: string
  claimTest?: string
}>(), {
  fileName: null,
  busy: false,
  disabled: false,
  managerHold: false,
  showManagerHold: true,
  managerHoldLabel: 'My manager already has the artwork',
  submitLabel: 'Submit artwork',
  hint: 'PDF, AI, PNG, JPG · up to 50 MB',
  error: '',
  notice: '',
  inputTest: 'artwork-input',
  pickTest: 'artwork-pick',
  uploadTest: 'artwork-upload',
  claimTest: 'artwork-with-manager',
})

const emit = defineEmits<{
  pick: [file: File]
  clear: []
  submit: []
  'update:managerHold': [value: boolean]
}>()

const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

function openPicker() {
  if (props.disabled || props.busy) return
  input.value?.click()
}

function accept(file: File | null | undefined) {
  if (!file || props.disabled || props.busy) return
  emit('pick', file)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  accept(target.files?.[0])
  target.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  accept(event.dataTransfer?.files?.[0])
}

function toggleHold(event: Event) {
  emit('update:managerHold', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <div>
    <input
      ref="input"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png,.ai,.eps"
      class="hidden"
      :data-test="props.inputTest"
      @change="onInput"
    >

    <button
      type="button"
      class="flex w-full flex-col items-center gap-2 rounded-3xl border-2 border-dashed bg-paper-2/50 p-8 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      :class="dragging ? 'border-brand bg-mint/50' : 'border-line-strong hover:border-brand hover:bg-mint/30'"
      :data-test="props.pickTest"
      :disabled="props.disabled || props.busy"
      @click="openPicker"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint">
        <Upload :size="22" class="text-brand-deep" aria-hidden="true" />
      </span>
      <span class="text-[14px] font-bold tracking-tight text-ink">
        {{ props.fileName || 'Drop artwork here or choose a file' }}
      </span>
      <span class="text-[11.5px] leading-relaxed text-ink-2">{{ props.hint }}</span>
    </button>

    <p v-if="props.fileName" class="mt-2 flex flex-wrap items-center gap-2 text-[11.5px] text-ink-2">
      <span class="truncate font-semibold text-ink">{{ props.fileName }}</span>
      <button type="button" class="font-semibold text-brand underline underline-offset-2 hover:text-brand-deep" @click="emit('clear')">
        Replace
      </button>
    </p>

    <div v-if="props.busy" class="mt-3 h-2 overflow-hidden rounded-full bg-paper-3" role="progressbar" aria-label="Uploading artwork">
      <div class="h-full w-1/2 animate-pulse rounded-full bg-brand" />
    </div>

    <label v-if="props.showManagerHold" class="mt-4 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-2">
      <input
        type="checkbox"
        class="mt-0.5 h-4 w-4 rounded border-line-strong text-brand focus:ring-brand"
        :checked="props.managerHold"
        :data-test="props.claimTest"
        :disabled="props.disabled || props.busy"
        @change="toggleHold"
      >
      <span>{{ props.managerHoldLabel }}</span>
    </label>

    <button
      type="button"
      class="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-[13px] font-bold text-white shadow-brand transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
      :data-test="props.uploadTest"
      :disabled="props.busy || props.disabled || (!props.fileName && !props.managerHold)"
      @click="emit('submit')"
    >
      <Loader2 v-if="props.busy" :size="15" class="animate-spin" aria-hidden="true" />
      <Upload v-else :size="15" aria-hidden="true" />
      {{ props.busy ? 'Uploading…' : props.submitLabel }}
    </button>

    <p v-if="props.error" class="mt-3 text-[12px] font-semibold text-red">{{ props.error }}</p>
    <p v-else-if="props.notice" class="mt-3 text-[12px] font-semibold text-brand-deep">{{ props.notice }}</p>
  </div>
</template>
