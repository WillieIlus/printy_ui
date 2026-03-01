<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormInput name="customer_name" label="Customer name" placeholder="Name" required />
      <FormsFormInput name="customer_email" label="Customer email" type="email" placeholder="email@example.com" required />
      <FormsFormInput name="customer_phone" label="Customer phone" placeholder="+1 555 000 0000" />
      <FormsFormRichText name="notes" label="Notes" placeholder="Notes..." />
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">Save</UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { Quote, RateCard, PriceCalculationInput, PriceCalculationResult } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

const props = withDefaults(
  defineProps<{
    quote?: Quote | null
    loading?: boolean
    slug?: string
    rateCard?: RateCard | null
    submitLabel?: string
  }>(),
  { submitLabel: 'Submit Request' }
)

const emit = defineEmits<{ submit: [data: Partial<Quote> & Record<string, unknown>]; cancel: [] }>()

const schema = object({
  customer_name: string().required('Name is required'),
  customer_email: string().email('Invalid email').required('Email is required'),
  customer_phone: string(),
  notes: string(),
})

const initialValues = computed(() => ({
  customer_name: props.quote?.customer_name ?? '',
  customer_email: props.quote?.customer_email ?? '',
  customer_phone: props.quote?.customer_phone ?? '',
  notes: props.quote?.notes ?? '',
}))

// Pricing form state (when rate card available)
const sheetSize = ref<'A5' | 'A4' | 'A3' | 'SRA3'>('A3')
const gsm = ref(150)
const quantity = ref(100)
const sides = ref<1 | 2>(1)
const paperType = ref<'GLOSS' | 'MATTE' | 'BOND' | 'ART'>('GLOSS')
const selectedFinishing = ref<number[]>([])

const availableGSM = computed(() => {
  if (!props.rateCard?.paper) return [80, 100, 130, 150, 170, 200, 250, 300]
  const gsms = [...new Set(props.rateCard.paper.map(p => p.gsm))]
  return gsms.sort((a, b) => a - b)
})

const pricingStore = usePricingStore()
const pricingResult = ref<PriceCalculationResult | null>(null)
let debounceTimer: ReturnType<typeof setTimeout>

async function calculatePrice() {
  if (!props.slug || !props.rateCard) return
  try {
    const input: PriceCalculationInput = {
      sheet_size: sheetSize.value,
      gsm: gsm.value,
      quantity: quantity.value,
      sides: sides.value,
      paper_type: paperType.value,
      finishing_ids: selectedFinishing.value,
    }
    pricingResult.value = await pricingStore.calculatePrice(props.slug, input)
  } catch {
    pricingResult.value = null
  }
}

watch([sheetSize, gsm, quantity, sides, paperType, selectedFinishing], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(calculatePrice, 400)
}, { immediate: false })

watch([() => props.slug, () => props.rateCard], () => {
  if (props.slug && props.rateCard) {
    calculatePrice()
  } else {
    pricingResult.value = null
  }
}, { immediate: true })

function onSubmit(values: Partial<Quote>) {
  const payload: Partial<Quote> & Record<string, unknown> = {
    customer_name: values.customer_name ?? '',
    customer_email: values.customer_email ?? '',
    customer_phone: values.customer_phone || null,
    notes: values.notes || null,
  }
  if (props.slug && props.rateCard) {
    payload.sheet_size = sheetSize.value
    payload.gsm = gsm.value
    payload.quantity = quantity.value
    payload.sides = sides.value
    payload.paper_type = paperType.value
    payload.finishing_ids = selectedFinishing.value
  }
  emit('submit', payload)
}
</script>
