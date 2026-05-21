<template>
  <UiCard class="space-y-6 border-slate-900/10 bg-white p-0">
    <div class="rounded-t-[1.75rem] border-b border-slate-200 bg-slate-950 px-6 py-5 text-white sm:px-7">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#f7a37a]">Instant estimate</p>
          <h2 class="mt-3 text-2xl font-black tracking-tight">Start with the spec, not the guesswork.</h2>
          <p class="mt-2 max-w-lg text-sm leading-6 text-slate-300">Build a quote-ready print brief with backend-driven production math and clear KES output.</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Pricing source</p>
          <p class="mt-1 text-sm font-semibold text-white">Calculated from real print production rules</p>
        </div>
      </div>
    </div>

    <div class="px-6 pb-6 pt-1 sm:px-7 sm:pb-7">
      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="$emit('submit')">
        <UiSelect v-model="model.product_type" label="Product type" :options="productOptions" />
        <UiInput v-model="model.quantity" type="number" min="1" label="Quantity" />
        <UiSelect v-model="model.finished_size" label="Finished size" :options="sizeOptions" />
        <UiSelect v-model="model.print_sides" label="Print sides" :options="sidesOptions" />
        <UiSelect v-model="model.color_mode" label="Colour" :options="colourOptions" />
        <UiSelect v-model="model.paper_stock" label="Paper stock" :options="paperOptions" />
        <UiInput v-model="model.requested_gsm" type="number" min="1" label="Preferred GSM" />
        <UiSelect v-model="model.lamination" label="Lamination" :options="laminationOptions" />
        <div class="md:col-span-2">
          <UiTextarea v-model="model.custom_brief" label="Artwork or special notes" placeholder="Add finishing notes, delivery context, or file concerns." />
        </div>
        <div class="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">Safe public estimate</p>
              <p class="mt-1 text-sm text-slate-600">Use this to understand production cost before you upload or request a live quote.</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <UiButton type="submit" :loading="loading" size="lg">See KES estimate</UiButton>
              <UiButton to="/auth/register" variant="secondary" size="lg">Create account / request quote</UiButton>
            </div>
          </div>
        </div>
      </form>
      <p class="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">No hidden currency switch. KES only.</p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/UiButton.vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiInput from '~/components/ui/UiInput.vue'
import UiSelect from '~/components/ui/UiSelect.vue'
import UiTextarea from '~/components/ui/UiTextarea.vue'

const model = defineModel<Record<string, any>>({ required: true })

defineProps<{
  productOptions: Array<{ value: string; label: string }>
  sizeOptions: Array<{ value: string; label: string }>
  paperOptions: Array<{ value: string; label: string }>
  loading?: boolean
}>()

defineEmits<{
  submit: []
}>()

const sidesOptions = [
  { value: 'SIMPLEX', label: 'Single sided' },
  { value: 'DUPLEX', label: 'Double sided' },
]

const colourOptions = [
  { value: 'COLOR', label: 'Colour' },
  { value: 'BW', label: 'Black and white' },
]

const laminationOptions = [
  { value: 'none', label: 'No lamination' },
  { value: 'gloss-lamination', label: 'Gloss lamination' },
  { value: 'matt-lamination', label: 'Matt lamination' },
]
</script>
