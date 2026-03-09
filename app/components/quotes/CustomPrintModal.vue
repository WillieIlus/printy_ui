<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="$emit('update:modelValue', false)"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        />

        <!-- Modal panel -->
        <div
          class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--p-surface)] rounded-2xl shadow-2xl z-10"
          @click.stop
        >
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[var(--p-surface)]/95 backdrop-blur-sm border-b border-[var(--p-border)] px-6 py-4 rounded-t-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-[var(--p-text)]">
              Request Custom Print
            </h2>
            <p class="text-sm text-[var(--p-text-muted)] mt-0.5">
              Specify your custom print job. Niko na design yangu = I already have artwork.
            </p>
          </div>
          <button
            class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
            @click="$emit('update:modelValue', false)"
          >
            <UIcon name="i-lucide-x" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="min-h-[200px] p-6 space-y-4">
        <div v-if="loadError" class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200">
          {{ loadError }}
          <UButton variant="link" size="xs" class="mt-2" @click="loadOptions">Retry</UButton>
        </div>
        <div v-else-if="submitError" class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20 p-3 text-sm text-red-800 dark:text-red-200">
          {{ submitError }}
          <p class="text-xs mt-1">Your entered values are preserved. You can fix and try again.</p>
        </div>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <UFormField label="Title" required>
            <UInput v-model="form.title" placeholder="e.g. Custom Artwork Print" required />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Width (cm)" required>
              <UInput v-model.number="form.width_cm" type="number" min="0.1" step="0.1" placeholder="14" required />
            </UFormField>
            <UFormField label="Height (cm)" required>
              <UInput v-model.number="form.height_cm" type="number" min="0.1" step="0.1" placeholder="17" required />
            </UFormField>
          </div>

          <UFormField label="Quantity" required>
            <UInput v-model.number="form.quantity" type="number" min="1" placeholder="400" required />
          </UFormField>

          <UFormField v-if="paperOptions.length" label="Paper">
            <USelectMenu
              v-model="form.paperId"
              :items="paperOptions"
              value-key="value"
              placeholder="Select paper"
            />
          </UFormField>
          <UFormField v-else label="Paper / specs">
            <UInput v-model="form.paperSpec" placeholder="e.g. 200gsm duplex" />
          </UFormField>

          <UFormField label="Sides">
            <USelectMenu
              v-model="form.sides"
              :items="sidesOptions"
              value-key="value"
            />
          </UFormField>

          <UFormField label="Color mode">
            <USelectMenu
              v-model="form.color_mode"
              :items="colorModeOptions"
              value-key="value"
            />
          </UFormField>

          <div class="flex items-center gap-2">
            <UCheckbox v-model="form.has_artwork" />
            <span class="text-sm">Niko na design yangu (I already have artwork)</span>
          </div>

          <UFormField label="Notes / spec text">
            <UTextarea v-model="form.spec_text" placeholder="e.g. 14cm by 17cm, 200gsm duplex, 400pcs" :rows="3" />
          </UFormField>

          <div class="flex justify-end gap-2 pt-4">
            <UButton variant="ghost" @click="$emit('update:modelValue', false)">Cancel</UButton>
            <UButton type="submit" color="primary" :loading="saving">Add to Quote Draft</UButton>
          </div>
        </form>
      </div>
    </div>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { AddCustomItemPayload } from '~/services/quoteDraft'
import { API } from '~/shared/api-paths'
import { usePublicApi } from '~/shared/api'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

const props = defineProps<{
  modelValue: boolean
  shopSlug: string
  paperOptions?: { value: number; label: string }[]
}>()
const loadError = ref('')
const submitError = ref('')

const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const quoteDraftStore = useQuoteDraftStore()
const toast = useToast()

const saving = ref(false)

const form = reactive({
  title: 'Custom Artwork Print',
  width_cm: 14,
  height_cm: 17,
  quantity: 400,
  paperId: null as number | null,
  paperSpec: '',
  sides: 'SIMPLEX' as 'SIMPLEX' | 'DUPLEX',
  color_mode: 'COLOR' as 'BW' | 'COLOR',
  has_artwork: false,
  spec_text: '',
})

const sidesOptions = [
  { value: 'SIMPLEX', label: 'Simplex (1-sided)' },
  { value: 'DUPLEX', label: 'Duplex (2-sided)' },
]

const colorModeOptions = [
  { value: 'BW', label: 'Black & White' },
  { value: 'COLOR', label: 'Color' },
]

const paperOptionsFromApi = ref<{ value: number; label: string }[]>([])
const paperOptions = computed(() => props.paperOptions?.length ? props.paperOptions : paperOptionsFromApi.value)

async function loadOptions() {
  loadError.value = ''
  try {
    const publicApi = usePublicApi()
    const data = await publicApi<{ available_papers?: Array<{ id: number; sheet_size: string; gsm: number; paper_type: string }> }>(
      API.publicShopCustomOptions(props.shopSlug)
    )
    paperOptionsFromApi.value = (data.available_papers ?? []).map((p) => ({
      value: p.id,
      label: `${p.sheet_size} ${p.gsm}gsm ${p.paper_type}`,
    }))
  } catch (err) {
    const { normalize } = useApiError()
    loadError.value = normalize(err, 'Could not load options').message
  }
}

watch(() => [props.modelValue, props.shopSlug] as const, ([open, slug]) => {
  if (open && slug) loadOptions()
}, { immediate: true })

watch(() => props.modelValue, (open) => {
  if (open) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
}, { immediate: true })

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('update:modelValue', false)
}
watch(() => props.modelValue, (open) => {
  if (open) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})

function buildSpecText(): string {
  const parts: string[] = []
  parts.push(`${form.width_cm}cm × ${form.height_cm}cm`)
  if (form.paperSpec) {
    parts.push(form.paperSpec)
  } else if (form.paperId && paperOptions.value.length) {
    const p = paperOptions.value.find((o) => o.value === form.paperId)
    if (p) parts.push(p.label)
  }
  parts.push(form.sides === 'DUPLEX' ? 'duplex' : 'simplex')
  parts.push(`${form.quantity} pcs`)
  if (form.spec_text) parts.push(form.spec_text)
  return parts.join(', ')
}

async function onSubmit() {
  saving.value = true
  try {
    quoteDraftStore.setShop(props.shopSlug)
    const spec_text = form.spec_text || buildSpecText()
    const payload: AddCustomItemPayload = {
      item_type: 'CUSTOM',
      title: form.title,
      spec_text,
      quantity: form.quantity,
      chosen_width_mm: Math.round(form.width_cm * 10),
      chosen_height_mm: Math.round(form.height_cm * 10),
      sides: form.sides,
      color_mode: form.color_mode,
      has_artwork: form.has_artwork,
    }
    if (form.paperId) payload.paper = form.paperId
    await quoteDraftStore.addCustomToQuote(payload)
    submitError.value = ''
    toast.add({ title: 'Added to Quote', description: `${form.title} added.` })
    emit('update:modelValue', false)
  } catch (err) {
    const { normalize } = useApiError()
    const norm = normalize(err, 'Could not add')
    submitError.value = norm.message
    toast.add({
      title: norm.title,
      description: norm.message,
      color: 'error',
    })
    // Do NOT close modal - preserve form state per spec
  } finally {
    saving.value = false
  }
}
</script>
