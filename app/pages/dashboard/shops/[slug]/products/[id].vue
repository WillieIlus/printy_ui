<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      :title="productStore.currentProduct?.name ?? 'Product'"
      :subtitle="slug"
    >
      <template #actions>
        <!-- Prominent toggles in the header -->
        <div v-if="productStore.currentProduct" class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <UToggle
              :model-value="productStore.currentProduct.status === 'PUBLISHED'"
              :loading="productStore.isToggleLoading(id, 'is_published')"
              :disabled="productStore.isToggleLoading(id, 'is_published')"
              @update:model-value="onToggle('is_published', $event)"
            />
            <span class="text-sm text-[var(--p-text-muted)]">
              {{ productStore.currentProduct.status === 'PUBLISHED' ? 'Published' : (productStore.currentProduct.status === 'UNAVAILABLE' ? 'Unavailable' : 'Draft') }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <UToggle
              :model-value="productStore.currentProduct.is_public !== false"
              :loading="productStore.isToggleLoading(id, 'is_public')"
              :disabled="productStore.isToggleLoading(id, 'is_public')"
              @update:model-value="onToggle('is_public', $event)"
            />
            <span class="text-sm text-[var(--p-text-muted)]">
              {{ productStore.currentProduct.is_public !== false ? 'Public' : 'Hidden' }}
            </span>
          </div>
        </div>
        <UButton :to="`/dashboard/shops/${slug}/products`" variant="soft" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="productStore.loading && !productStore.currentProduct" variant="block" />

    <template v-else-if="productStore.currentProduct">
      <!-- ── Draft / published banner ── -->
      <UAlert
        v-if="productStore.currentProduct.status !== 'PUBLISHED'"
        color="warning"
        variant="soft"
        icon="i-lucide-eye-off"
        title="Not visible to customers"
        :description="productStore.currentProduct.status === 'UNAVAILABLE' ? 'This product is marked Unavailable and will not appear in public listings.' : 'This product is a Draft — not visible to customers until published.'"
      >
        <template v-if="productStore.currentProduct.status !== 'UNAVAILABLE'" #actions>
          <UButton
            color="warning"
            variant="solid"
            size="sm"
            :loading="productStore.isToggleLoading(id, 'is_published')"
            @click="onToggle('is_published', true)"
          >
            Publish now
          </UButton>
        </template>
      </UAlert>

      <UAlert
        v-else-if="productStore.currentProduct.is_public === false"
        color="info"
        variant="soft"
        icon="i-lucide-lock"
        title="Published but hidden"
        description="This product is published but not shown in the public gallery. Toggle 'Public' in the header to make it visible."
      />

      <!-- ── Overview ── -->
      <div class="grid gap-6 lg:grid-cols-2">
        <DashboardSectionCard title="Overview">
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Status</dt>
              <dd>
                <UBadge
                  :color="productStore.currentProduct.status === 'PUBLISHED' ? 'success' : (productStore.currentProduct.status === 'UNAVAILABLE' ? 'error' : 'neutral')"
                  variant="soft"
                  size="sm"
                >
                  {{ productStore.currentProduct.status ?? 'DRAFT' }}
                </UBadge>
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Pricing mode</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.pricing_mode }}</dd>
            </div>
            <div v-if="productStore.currentProduct.product_kind" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Product kind</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.product_kind }}</dd>
            </div>
            <div v-if="productStore.currentProduct.default_finished_width_mm" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Finished size</dt>
              <dd class="font-medium text-[var(--p-text)]">
                {{ productStore.currentProduct.default_finished_width_mm }} × {{ productStore.currentProduct.default_finished_height_mm }} mm
              </dd>
            </div>
            <div v-if="productStore.currentProduct.min_quantity" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Min quantity</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.min_quantity }}</dd>
            </div>
            <div v-if="productStore.currentProduct.default_sides" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Default sides</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.default_sides }}</dd>
            </div>
            <div v-if="productStore.currentProduct.default_sheet_size" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Parent sheet</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.default_sheet_size }}</dd>
            </div>
          </dl>
        </DashboardSectionCard>

        <DashboardSectionCard title="Turnaround &amp; Constraints">
          <dl class="space-y-3 text-sm">
            <div v-if="productStore.currentProduct.standard_turnaround_hours" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Standard TAT</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.standard_turnaround_hours }}h</dd>
            </div>
            <div v-if="productStore.currentProduct.rush_available" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Rush TAT</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.rush_turnaround_hours ?? '—' }}h</dd>
            </div>
            <div v-if="productStore.currentProduct.min_gsm || productStore.currentProduct.max_gsm" class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">GSM range</dt>
              <dd class="font-medium text-[var(--p-text)]">
                {{ productStore.currentProduct.min_gsm ?? '—' }} – {{ productStore.currentProduct.max_gsm ?? '—' }} gsm
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Allow simplex</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.allow_simplex ? 'Yes' : 'No' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-[var(--p-text-muted)]">Allow duplex</dt>
              <dd class="font-medium text-[var(--p-text)]">{{ productStore.currentProduct.allow_duplex ? 'Yes' : 'No' }}</dd>
            </div>
          </dl>
        </DashboardSectionCard>
      </div>

      <!-- ── Edit form ── -->
      <DashboardSectionCard title="Edit Product">
        <div v-if="productStore.error && !productStore.loading" class="mb-4">
          <UAlert color="error" icon="i-lucide-alert-circle" :description="productStore.error" />
        </div>

        <VeeForm
          v-slot="{ meta, isSubmitting }"
          :validation-schema="schema"
          :initial-values="initialValues"
          @submit="onSubmit"
        >
          <div class="space-y-8">
            <!-- Basics -->
            <DashboardFormSection title="Basics" description="Name, description, and visibility settings.">
              <div class="grid gap-5 md:grid-cols-2">
                <div class="md:col-span-2">
                  <FormsFormInput name="name" label="Product Name" placeholder="Business Cards" required />
                </div>
                <div class="md:col-span-2">
                  <FormsFormTextarea name="description" label="Description" placeholder="Product description..." :rows="3" />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-[var(--p-text-highlighted)]">Pricing Mode</label>
                  <VeeField v-slot="{ field, errors }" name="pricing_mode">
                    <USelectMenu
                      :model-value="field.value"
                      :items="pricingModes"
                      value-key="value"
                      label-key="label"
                      size="xl"
                      portal="body"
                      @update:model-value="field.onChange($event)"
                    />
                    <p v-if="errors[0]" class="mt-1 text-xs text-red-500">{{ errors[0] }}</p>
                  </VeeField>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-[var(--p-text-highlighted)]">Default Sides</label>
                  <VeeField v-slot="{ field, errors }" name="default_sides">
                    <USelectMenu
                      :model-value="field.value"
                      :items="sidesOptions"
                      value-key="value"
                      label-key="label"
                      size="xl"
                      portal="body"
                      @update:model-value="field.onChange($event)"
                    />
                    <p v-if="errors[0]" class="mt-1 text-xs text-red-500">{{ errors[0] }}</p>
                  </VeeField>
                </div>
              </div>
            </DashboardFormSection>

            <!-- Specifications -->
            <DashboardFormSection title="Specifications" description="Finished dimensions, parent sheet, and quantity.">
              <div class="grid gap-5 md:grid-cols-2">
                <FormsFormInput name="default_finished_width_mm" label="Finished Width (mm)" type="number" placeholder="90" />
                <FormsFormInput name="default_finished_height_mm" label="Finished Height (mm)" type="number" placeholder="54" />
                <FormsFormInput name="default_bleed_mm" label="Bleed (mm)" type="number" placeholder="3" />
                <FormsFormInput name="min_quantity" label="Min Quantity" type="number" placeholder="100" />

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-[var(--p-text-highlighted)]">Parent Sheet</label>
                  <VeeField v-slot="{ field }" name="default_sheet_size">
                    <USelectMenu
                      :model-value="field.value"
                      :items="sheetSizeOptions"
                      value-key="value"
                      label-key="label"
                      size="xl"
                      portal="body"
                      @update:model-value="field.onChange($event)"
                    />
                  </VeeField>
                </div>
              </div>
            </DashboardFormSection>

            <!-- Turnaround -->
            <DashboardFormSection title="Turnaround" description="Production time and rush availability.">
              <div class="grid gap-5 md:grid-cols-2">
                <FormsFormInput name="standard_turnaround_hours" label="Standard (working hours)" type="number" placeholder="16" />
                <FormsFormInput name="buffer_hours" label="Buffer (hours)" type="number" placeholder="1" />
                <FormsFormInput name="queue_hours" label="Queue delay (hours)" type="number" placeholder="0" />

                <div class="space-y-2">
                  <label class="flex items-center gap-3 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm text-[var(--p-text)]">
                    <VeeField v-slot="{ field }" name="rush_available" type="checkbox">
                      <UCheckbox
                        :model-value="field.value"
                        @update:model-value="field.onChange($event)"
                      />
                    </VeeField>
                    <span>Rush turnaround available</span>
                  </label>
                </div>

                <FormsFormInput name="rush_turnaround_hours" label="Rush (working hours)" type="number" placeholder="8" />
              </div>
            </DashboardFormSection>

            <!-- Constraints -->
            <DashboardFormSection title="Constraints" description="Paper weight and size limits.">
              <div class="grid gap-5 md:grid-cols-2">
                <FormsFormInput name="min_gsm" label="Min GSM" type="number" placeholder="250" />
                <FormsFormInput name="max_gsm" label="Max GSM" type="number" placeholder="350" />
                <FormsFormInput name="max_width_mm" label="Max Width (mm)" type="number" placeholder="90" />
                <FormsFormInput name="max_height_mm" label="Max Height (mm)" type="number" placeholder="54" />

                <label class="flex items-center gap-3 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm text-[var(--p-text)]">
                  <VeeField v-slot="{ field }" name="allow_simplex" type="checkbox">
                    <UCheckbox :model-value="field.value" @update:model-value="field.onChange($event)" />
                  </VeeField>
                  <span>Allow simplex jobs</span>
                </label>

                <label class="flex items-center gap-3 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm text-[var(--p-text)]">
                  <VeeField v-slot="{ field }" name="allow_duplex" type="checkbox">
                    <UCheckbox :model-value="field.value" @update:model-value="field.onChange($event)" />
                  </VeeField>
                  <span>Allow duplex jobs</span>
                </label>
              </div>
            </DashboardFormSection>

            <!-- Display labels -->
            <DashboardFormSection title="Display Labels" description="Human-readable labels for gallery and listings.">
              <div class="grid gap-5 md:grid-cols-2">
                <FormsFormInput name="dimensions_label" label="Dimensions Label" placeholder="90 × 55 mm" />
                <FormsFormInput name="weight_label" label="Weight Label" placeholder="350gsm" />
              </div>
            </DashboardFormSection>

            <div class="flex justify-end gap-3 pt-2">
              <UButton
                :to="`/dashboard/shops/${slug}/products`"
                variant="soft"
              >
                Cancel
              </UButton>
              <UButton
                type="submit"
                color="primary"
                :loading="isSubmitting || productStore.loading"
                :disabled="!meta.dirty || isSubmitting"
              >
                Save changes
              </UButton>
            </div>
          </div>
        </VeeForm>
      </DashboardSectionCard>
    </template>

    <DashboardEmptyState
      v-else-if="!productStore.loading"
      title="Product not found"
      description="This product could not be loaded."
      icon="i-lucide-package-x"
    >
      <UButton :to="`/dashboard/shops/${slug}/products`" variant="soft">Back to Products</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import { object, string, number } from 'yup'
import type { Product } from '~/shared/types'
import { useProductStore } from '~/stores/product'
import { useShopStore } from '~/stores/shop'
import { useNotification } from '~/composables/useNotification'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner', 'shop-setup-step'],
})

const route = useRoute()
const shopStore = useShopStore()
const productStore = useProductStore()
const notification = useNotification()

const slug = computed(() => route.params.slug as string)
const id = computed(() => Number(route.params.id))

// ─── Validation schema ────────────────────────────────────────────────────────
const schema = object({
  name: string().required('Product name is required').min(2, 'Name must be at least 2 characters'),
  description: string(),
  pricing_mode: string().required('Pricing mode is required'),
  default_sides: string(),
  default_finished_width_mm: number().nullable().typeError('Must be a number'),
  default_finished_height_mm: number().nullable().typeError('Must be a number'),
  default_bleed_mm: number().nullable().typeError('Must be a number'),
  min_quantity: number().nullable().min(1, 'Must be at least 1').typeError('Must be a number'),
  default_sheet_size: string(),
  standard_turnaround_hours: number().nullable().min(1).typeError('Must be a number'),
  rush_turnaround_hours: number().nullable().min(1).typeError('Must be a number'),
  rush_available: string(),
  buffer_hours: number().nullable().min(0).typeError('Must be a number'),
  queue_hours: number().nullable().min(0).typeError('Must be a number'),
  min_gsm: number().nullable().typeError('Must be a number'),
  max_gsm: number().nullable().typeError('Must be a number'),
  max_width_mm: number().nullable().typeError('Must be a number'),
  max_height_mm: number().nullable().typeError('Must be a number'),
  allow_simplex: string(),
  allow_duplex: string(),
  dimensions_label: string(),
  weight_label: string(),
})

// ─── Initial form values from currentProduct ─────────────────────────────────
const initialValues = computed(() => {
  const p = productStore.currentProduct
  if (!p) return {}
  return {
    name: p.name ?? '',
    description: p.description ?? '',
    pricing_mode: p.pricing_mode ?? 'SHEET',
    default_sides: p.default_sides ?? 'DUPLEX',
    default_finished_width_mm: p.default_finished_width_mm ?? '',
    default_finished_height_mm: p.default_finished_height_mm ?? '',
    default_bleed_mm: p.default_bleed_mm ?? 3,
    min_quantity: p.min_quantity ?? 100,
    default_sheet_size: p.default_sheet_size ?? '',
    standard_turnaround_hours: p.standard_turnaround_hours ?? '',
    rush_turnaround_hours: p.rush_turnaround_hours ?? '',
    rush_available: p.rush_available ?? false,
    buffer_hours: p.buffer_hours ?? 0,
    queue_hours: p.queue_hours ?? 0,
    min_gsm: p.min_gsm ?? '',
    max_gsm: p.max_gsm ?? '',
    max_width_mm: p.max_width_mm ?? '',
    max_height_mm: p.max_height_mm ?? '',
    allow_simplex: p.allow_simplex ?? true,
    allow_duplex: p.allow_duplex ?? true,
    dimensions_label: p.dimensions_label ?? '',
    weight_label: p.weight_label ?? '',
  }
})

// ─── Select options ───────────────────────────────────────────────────────────
const pricingModes = [
  { label: 'Sheet Product', value: 'SHEET' },
  { label: 'Large Format', value: 'LARGE_FORMAT' },
]
const sidesOptions = [
  { label: 'Simplex', value: 'SIMPLEX' },
  { label: 'Duplex', value: 'DUPLEX' },
]
const sheetSizeOptions = [
  { label: 'None / infer from shop', value: '' },
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'SRA3', value: 'SRA3' },
  { label: 'SRA4', value: 'SRA4' },
  { label: 'B2', value: 'B2' },
]

// ─── Toggles ──────────────────────────────────────────────────────────────────
async function onToggle(field: 'is_published' | 'is_public', value: boolean) {
  const result = await productStore.toggleField(slug.value, id.value, field, value)
  if (!result.success) {
    notification.error(result.error ?? 'Could not update product.')
  }
}

// ─── Form submit ──────────────────────────────────────────────────────────────
async function onSubmit(values: Record<string, unknown>) {
  const payload: Partial<Product> = {
    name: values.name as string,
    description: (values.description as string) || '',
    pricing_mode: values.pricing_mode as Product['pricing_mode'],
    default_sides: (values.default_sides as Product['default_sides']) || undefined,
    default_finished_width_mm: toNum(values.default_finished_width_mm),
    default_finished_height_mm: toNum(values.default_finished_height_mm),
    default_bleed_mm: toNum(values.default_bleed_mm),
    min_quantity: toNum(values.min_quantity),
    default_sheet_size: (values.default_sheet_size as string) || '',
    standard_turnaround_hours: toNum(values.standard_turnaround_hours),
    rush_turnaround_hours: toNum(values.rush_turnaround_hours),
    rush_available: Boolean(values.rush_available),
    buffer_hours: toNum(values.buffer_hours) ?? 0,
    queue_hours: toNum(values.queue_hours) ?? 0,
    min_gsm: toNum(values.min_gsm),
    max_gsm: toNum(values.max_gsm),
    max_width_mm: toNum(values.max_width_mm),
    max_height_mm: toNum(values.max_height_mm),
    allow_simplex: Boolean(values.allow_simplex),
    allow_duplex: Boolean(values.allow_duplex),
    dimensions_label: (values.dimensions_label as string) || '',
    weight_label: (values.weight_label as string) || '',
  }

  const result = await productStore.updateProduct(slug.value, id.value, payload)
  if (result.success) {
    notification.success('Product saved successfully.')
  } else {
    if (!productStore.updateFieldErrors || Object.keys(productStore.updateFieldErrors).length === 0) {
      notification.error(productStore.error ?? 'Could not save product.')
    }
  }
}

function toNum(val: unknown): number | undefined {
  if (val === '' || val == null) return undefined
  const n = Number(val)
  return Number.isFinite(n) ? n : undefined
}

// ─── Mount ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await productStore.fetchByIdForDashboard(slug.value, id.value)
})
</script>
