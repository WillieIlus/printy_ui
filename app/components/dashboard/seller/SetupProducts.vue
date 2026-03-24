<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-[var(--p-text-muted)]">Products in your catalog. Link to papers/materials and finishing options.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add product
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <UAlert
      v-else-if="loadError"
      color="error"
      variant="soft"
      :title="loadError"
      icon="i-lucide-alert-circle"
      description="The products API may be unavailable. Check your connection and try again."
    >
      <template #actions>
        <UButton variant="soft" size="xs" @click="load">Retry</UButton>
      </template>
    </UAlert>
    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Mode</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Size (mm)</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Delivery</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Min qty</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Finishings</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="p in items" :key="p.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-[var(--p-text)]">{{ p.name }}</div>
              <div v-if="p.category" class="text-xs text-[var(--p-text-muted)]">{{ p.category }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ p.pricing_mode }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ p.default_finished_width_mm }} × {{ p.default_finished_height_mm }}</td>
            <td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">{{ formatTurnaround(p.turnaround_days) }}</td>
            <td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">{{ p.min_quantity ?? 1 }}</td>
            <td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">{{ p.finishing_options?.length ?? 0 }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="p.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ p.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="soft" size="xs" @click="edit(p)">Edit</UButton>
              <UButton variant="soft" size="xs" color="error" @click="confirmDelete(p)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loadError" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-package" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No products yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add products to your catalog for buyers to quote.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add product</UButton>
    </div>

    <DashboardModalForm
      v-model="modalOpen"
      :title="editing ? 'Edit product' : 'Add product'"
      :description="editing ? 'Update product.' : 'Add a product to your catalog.'"
      :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl rounded-lg shadow-xl ring ring-default' }"
    >
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div
          v-if="submitError"
          class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300"
        >
          {{ submitError }}
        </div>
        <DashboardLocalDraftNotice
          v-if="hasDraft && !editing"
          entity-label="product"
          :show-clear="true"
          @clear="clearDraft"
        />

        <!-- Basic info -->
        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Basic info</p>
          <UFormField label="Name" description="Display name of the product." required>
            <UInput v-model="form.name" placeholder="e.g. Business Cards" required />
          </UFormField>
          <UFormField label="Description" description="Product description.">
            <UTextarea v-model="form.description" placeholder="Optional" :rows="2" />
          </UFormField>
          <UFormField label="Category" description="Product category for gallery grouping.">
            <div class="space-y-2">
              <USelectMenu
                :model-value="categorySelectValue"
                :items="categorySelectItems"
                value-key="value"
                @update:model-value="onCategorySelect"
              />
              <div
                v-if="showAddCategory"
                class="flex items-center gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3"
              >
                <UInput
                  v-model="newCategoryName"
                  placeholder="New category name"
                  class="flex-1"
                  @keydown.enter.prevent="addNewCategory"
                />
                <UButton size="sm" color="primary" :loading="addingCategory" @click="addNewCategory">
                  Add
                </UButton>
                <UButton size="sm" variant="ghost" @click="showAddCategory = false">
                  Cancel
                </UButton>
              </div>
            </div>
          </UFormField>
          <UFormField label="Pricing mode" description="Sheet or large format pricing." required>
            <USelectMenu v-model="form.pricing_mode" :items="pricingModeOptions" value-key="value" />
          </UFormField>
          <UFormField
            v-if="form.pricing_mode === 'SHEET' && shopMachines.length"
            label="Default machine"
            description="Default printing machine for this product. Clients can override when adding to quote."
          >
            <USelectMenu
              :model-value="form.default_machine"
              :items="[{ value: null, label: '— None —' }, ...shopMachines.map(m => ({ value: m.id, label: m.name }))]"
              value-key="value"
              @update:model-value="(v: number | null) => { form.default_machine = v }"
            />
          </UFormField>
        </div>

        <!-- Dimensions -->
        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Dimensions</p>
          <p class="text-xs text-[var(--p-text-muted)]">Bleed is 3mm (used for auto imposition).</p>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Default width (mm)" description="Required for price range." required>
              <UInput v-model.number="form.default_finished_width_mm" type="number" min="1" required />
            </UFormField>
            <UFormField label="Default height (mm)" description="Required for price range." required>
              <UInput v-model.number="form.default_finished_height_mm" type="number" min="1" required />
            </UFormField>
          </div>
          <UFormField label="Bleed (mm)" description="Used for imposition calculation (default 3mm).">
            <UInput v-model.number="form.default_bleed_mm" type="number" min="0" />
          </UFormField>
          <UFormField label="Minimum quantity" description="Minimum order quantity for price range calculation.">
            <UInput v-model.number="form.min_quantity" type="number" min="1" placeholder="1" />
          </UFormField>
          <UFormField label="Delivery time (days)" description="Typical turnaround for this product.">
            <UInput v-model.number="form.turnaround_days" type="number" min="1" placeholder="Optional" />
          </UFormField>
          <template v-if="form.pricing_mode === 'LARGE_FORMAT'">
            <UFormField label="Min width (mm)" description="For LARGE_FORMAT price range.">
              <UInput v-model.number="form.min_width_mm" type="number" min="0" placeholder="Optional" />
            </UFormField>
            <UFormField label="Min height (mm)" description="For LARGE_FORMAT price range.">
              <UInput v-model.number="form.min_height_mm" type="number" min="0" placeholder="Optional" />
            </UFormField>
          </template>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Max width (mm)" description="e.g. 105 for A6 business cards.">
              <UInput v-model.number="form.max_width_mm" type="number" min="0" placeholder="Optional" />
            </UFormField>
            <UFormField label="Max height (mm)" description="e.g. 148 for A6.">
              <UInput v-model.number="form.max_height_mm" type="number" min="0" placeholder="Optional" />
            </UFormField>
          </div>
          <UFormField label="Default sheet size" description="Preferred sheet for price range (e.g. SRA3, A4).">
            <UInput v-model="form.default_sheet_size" placeholder="Optional" />
          </UFormField>
          <UFormField label="Default sides" description="Simplex (1-sided) or duplex (2-sided).">
            <USelectMenu v-model="form.default_sides" :items="sidesOptions" value-key="value" />
          </UFormField>
        </div>

        <!-- Paper constraints -->
        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Paper constraints</p>
          <p class="text-xs text-[var(--p-text-muted)]">e.g. business card 250–350 gsm; flyer 130–170 gsm.</p>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Min GSM" description="Minimum paper grammage allowed.">
              <UInput v-model.number="form.min_gsm" type="number" min="0" placeholder="Optional" />
            </UFormField>
            <UFormField label="Max GSM" description="Maximum paper grammage allowed.">
              <UInput v-model.number="form.max_gsm" type="number" min="0" placeholder="Optional" />
            </UFormField>
          </div>
          <UFormField label="Allowed sheet sizes" description="Comma-separated (e.g. A4,A3,SRA3). Empty = no restriction.">
            <UInput v-model="form.allowed_sheet_sizes_str" placeholder="Optional" />
          </UFormField>
          <div class="flex gap-6">
            <label class="flex items-center gap-2">
              <UCheckbox v-model="form.allow_simplex" />
              <span class="text-sm text-[var(--p-text-dim)]">Allow simplex</span>
            </label>
            <label class="flex items-center gap-2">
              <UCheckbox v-model="form.allow_duplex" />
              <span class="text-sm text-[var(--p-text-dim)]">Allow duplex</span>
            </label>
          </div>
        </div>

        <!-- Finishings section -->
        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Finishings</p>
          <p class="text-xs text-[var(--p-text-muted)]">Select finishing services applicable to this product.</p>

          <!-- Category filter for finishings -->
          <div v-if="finishingCategories.length" class="flex items-center gap-2 flex-wrap">
            <UBadge
              :color="!finishingCategoryFilter ? 'primary' : 'neutral'"
              variant="soft"
              class="cursor-pointer text-xs"
              @click="finishingCategoryFilter = ''"
            >
              All
            </UBadge>
            <UBadge
              v-for="cat in finishingCategories"
              :key="cat.slug"
              :color="finishingCategoryFilter === cat.slug ? 'primary' : 'neutral'"
              variant="soft"
              class="cursor-pointer text-xs"
              @click="finishingCategoryFilter = cat.slug"
            >
              {{ cat.name }}
            </UBadge>
          </div>

          <div v-if="finishingRatesLoading" class="text-sm text-[var(--p-text-muted)]">Loading finishing rates...</div>
          <div v-else-if="!filteredFinishingRates.length" class="text-sm text-[var(--p-text-muted)]">No finishing rates available. Add them in the Finishing setup tab first.</div>
          <div v-else class="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-[var(--p-border)] p-2">
            <label
              v-for="fr in filteredFinishingRates"
              :key="fr.id"
              class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--p-surface-sunken)] cursor-pointer"
            >
              <UCheckbox
                :model-value="form.finishing_options.some(fo => fo.finishing_rate === fr.id)"
                @update:model-value="toggleFinishing(fr.id, $event)"
              />
              <div class="flex-1 min-w-0">
                <span class="text-sm text-[var(--p-text)]">{{ fr.name }}</span>
                <span v-if="fr.category_detail" class="ml-2 text-xs text-[var(--p-text-muted)]">({{ fr.category_detail.name }})</span>
              </div>
              <span class="text-xs text-[var(--p-text-muted)] shrink-0">{{ fr.price }} / {{ fr.charge_unit }}</span>
            </label>
          </div>
        </div>

        <!-- Images section -->
        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Product Images</p>
          <p class="text-xs text-[var(--p-text-muted)]">Upload images for this product. The first image is used as the primary image.</p>

          <!-- Existing images (edit mode) -->
          <div v-if="existingImages.length" class="flex flex-wrap gap-3">
            <div
              v-for="img in existingImages"
              :key="img.id"
              class="relative group w-24 h-24 rounded-lg overflow-hidden border border-[var(--p-border)]"
            >
              <img :src="getMediaUrl(img.image)" :alt="`Product image ${img.id}`" class="w-full h-full object-cover" />
              <div v-if="img.is_primary" class="absolute top-1 left-1">
                <UBadge color="primary" variant="solid" size="xs">Primary</UBadge>
              </div>
              <button
                type="button"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                @click="removeExistingImage(img.id)"
              >
                ×
              </button>
            </div>
          </div>

          <!-- New image upload -->
          <div class="flex flex-wrap gap-3">
            <div
              v-for="(preview, i) in imagePreviews"
              :key="i"
              class="relative group w-24 h-24 rounded-lg overflow-hidden border border-[var(--p-border)]"
            >
              <img :src="preview" alt="Preview" class="w-full h-full object-cover" />
              <button
                type="button"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                @click="removeNewImage(i)"
              >
                ×
              </button>
            </div>
            <label
              class="w-24 h-24 rounded-lg border-2 border-dashed border-[var(--p-border)] flex items-center justify-center cursor-pointer hover:border-flamingo-400 transition-colors"
            >
              <UIcon name="i-lucide-plus" class="w-6 h-6 text-[var(--p-text-muted)]" />
              <input type="file" accept="image/*" multiple class="hidden" @change="onFileSelect" />
            </label>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_active" />
          <span class="text-sm text-[var(--p-text-dim)]">Active</span>
        </div>
      </form>
      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <UButton color="primary" :loading="saving" @click="onSubmit">Save</UButton>
        </div>
      </template>
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import type { Product, FinishingRate, FinishingCategory, ProductCategory } from '~/services/seller'
import {
  listProductsBySlug,
  createProductBySlug,
  updateProductBySlug,
  deleteProductBySlug,
  listFinishingRatesBySlug,
  listProductCategoriesBySlug,
  createProductCategoryBySlug,
} from '~/services/seller'
import { useApi as useRawApi } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { safeLogError } from '~/utils/safeLog'

const props = defineProps<{ shopSlug: string; shopExists?: boolean }>()

const toast = useToast()
const { getMediaUrl: composableGetMediaUrl } = useApi()
const items = ref<Product[]>([])
const loadError = ref<string | null>(null)
const submitError = ref<string | null>(null)
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<Product | null>(null)

// Product categories (for dropdown)
const productCategories = ref<ProductCategory[]>([])
const productCategoriesLoading = ref(false)
const showAddCategory = ref(false)
const newCategoryName = ref('')
const addingCategory = ref(false)

// Machines (for default_machine on SHEET products)
const shopMachines = ref<Array<{ id: number; name: string }>>([])

// Finishing data
const shopFinishingRates = ref<FinishingRate[]>([])
const finishingCategories = ref<FinishingCategory[]>([])
const finishingRatesLoading = ref(false)
const finishingCategoryFilter = ref('')

const filteredFinishingRates = computed(() => {
  if (!finishingCategoryFilter.value) return shopFinishingRates.value
  return shopFinishingRates.value.filter(
    fr => fr.category_detail?.slug === finishingCategoryFilter.value
  )
})

const categorySelectItems = computed(() => {
  const items: { value: number | null | typeof ADD_CATEGORY_VALUE; label: string }[] = [
    { value: null, label: '— None —' },
    ...productCategories.value.map(c => ({ value: c.id as number, label: c.name })),
    { value: ADD_CATEGORY_VALUE, label: '+ Add new category...' },
  ]
  return items
})

const categorySelectValue = computed(() => {
  if (showAddCategory.value) return ADD_CATEGORY_VALUE
  const c = form.value.category
  return typeof c === 'number' ? c : null
})

function onCategorySelect(v: number | null | typeof ADD_CATEGORY_VALUE) {
  if (v === ADD_CATEGORY_VALUE) {
    showAddCategory.value = true
    newCategoryName.value = ''
  } else {
    showAddCategory.value = false
    form.value.category = v as number | null
  }
}

async function loadProductCategories() {
  if (!props.shopSlug) return
  productCategoriesLoading.value = true
  try {
    productCategories.value = await listProductCategoriesBySlug(props.shopSlug)
  } catch {
    productCategories.value = []
  } finally {
    productCategoriesLoading.value = false
  }
}

async function addNewCategory() {
  const name = newCategoryName.value.trim()
  if (!name) return
  addingCategory.value = true
  try {
    const created = await createProductCategoryBySlug(props.shopSlug, { name })
    productCategories.value = [...productCategories.value, created]
    form.value.category = created.id
    showAddCategory.value = false
    newCategoryName.value = ''
    toast.add({ title: 'Category added', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  } finally {
    addingCategory.value = false
  }
}

// Image handling
const newImageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const existingImages = ref<{ id: number; image: string; is_primary: boolean; display_order: number }[]>([])
const imagesToDelete = ref<number[]>([])

interface FormFinishingOption {
  finishing_rate: number
  is_default: boolean
  price_adjustment: string | null
}

const DRAFT_KEY = computed(() => `product-draft-${props.shopSlug}`)

const ADD_CATEGORY_VALUE = '__add__' as const

const defaultForm = {
  name: '',
  description: '',
  category: null as number | null,
  pricing_mode: 'SHEET',
  default_finished_width_mm: 90,
  default_finished_height_mm: 54,
  default_sheet_size: '' as string,
  default_bleed_mm: 3,
  min_quantity: 1,
  turnaround_days: null as number | null,
  min_width_mm: null as number | null,
  min_height_mm: null as number | null,
  max_width_mm: null as number | null,
  max_height_mm: null as number | null,
  min_gsm: null as number | null,
  max_gsm: null as number | null,
  allowed_sheet_sizes_str: '' as string,
  allow_simplex: true,
  allow_duplex: true,
  default_sides: 'SIMPLEX',
  default_machine: null as number | null,
  is_active: true,
  finishing_options: [] as FormFinishingOption[],
}

const form = useStorage(DRAFT_KEY.value, { ...defaultForm })
const hasDraft = computed(() => form.value.name.trim().length > 0)

const pricingModeOptions = [
  { value: 'SHEET', label: 'Sheet' },
  { value: 'LARGE_FORMAT', label: 'Large Format' },
]

const sidesOptions = [
  { value: 'SIMPLEX', label: 'Simplex (1-sided)' },
  { value: 'DUPLEX', label: 'Duplex (2-sided)' },
]

function toggleFinishing(finishingRateId: number, checked: boolean) {
  if (checked) {
    form.value.finishing_options.push({
      finishing_rate: finishingRateId,
      is_default: false,
      price_adjustment: null,
    })
  } else {
    form.value.finishing_options = form.value.finishing_options.filter(
      fo => fo.finishing_rate !== finishingRateId
    )
  }
}

function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  for (const file of Array.from(target.files)) {
    newImageFiles.value.push(file)
    imagePreviews.value.push(URL.createObjectURL(file))
  }
  target.value = ''
}

function removeNewImage(index: number) {
  URL.revokeObjectURL(imagePreviews.value[index])
  newImageFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

function removeExistingImage(imageId: number) {
  imagesToDelete.value.push(imageId)
  existingImages.value = existingImages.value.filter(img => img.id !== imageId)
}

function getMediaUrl(path: string) {
  return composableGetMediaUrl(path) ?? ''
}

function formatTurnaround(days?: number | null) {
  if (!days) return 'On request'
  return `${days} day${days === 1 ? '' : 's'}`
}

async function loadFinishingData() {
  finishingRatesLoading.value = true
  try {
    const [rates, categories] = await Promise.all([
      listFinishingRatesBySlug(props.shopSlug),
      loadCategories(),
    ])
    shopFinishingRates.value = rates
    finishingCategories.value = categories
  } catch {
    shopFinishingRates.value = []
    finishingCategories.value = []
  } finally {
    finishingRatesLoading.value = false
  }
}

async function loadCategories(): Promise<FinishingCategory[]> {
  const api = useRawApi()
  try {
    const data = await api<FinishingCategory[] | { results: FinishingCategory[] }>(API.finishingCategories())
    return Array.isArray(data) ? data : (data as { results: FinishingCategory[] }).results ?? []
  } catch {
    return []
  }
}

async function load() {
  if (!props.shopSlug) return
  loading.value = true
  loadError.value = null
  try {
    items.value = await listProductsBySlug(props.shopSlug)
  } catch (e: unknown) {
    items.value = []
    const err = e as { statusCode?: number; status?: number; message?: string }
    const status = err?.statusCode ?? err?.status
    loadError.value = status === 500
      ? 'Server error (500) — products API may need a backend deploy.'
      : (e instanceof Error ? e.message : 'Failed to load products')
  } finally {
    loading.value = false
  }
}

function clearDraft() {
  if (import.meta.client) {
    localStorage.removeItem(DRAFT_KEY.value)
  }
  Object.assign(form.value, { ...defaultForm, finishing_options: [] })
}

function openModal(p?: Product) {
  submitError.value = null
  editing.value = p ?? null
  imagePreviews.value = []
  newImageFiles.value = []
  imagesToDelete.value = []
  existingImages.value = []

  if (p) {
    form.value.name = p.name
    form.value.description = p.description ?? ''
    form.value.category = typeof p.category === 'number' ? p.category : null
    form.value.pricing_mode = p.pricing_mode
    form.value.default_finished_width_mm = p.default_finished_width_mm
    form.value.default_finished_height_mm = p.default_finished_height_mm
    form.value.default_bleed_mm = p.default_bleed_mm
    form.value.min_quantity = p.min_quantity ?? 1
    form.value.turnaround_days = p.turnaround_days ?? null
    form.value.min_width_mm = p.min_width_mm ?? null
    form.value.min_height_mm = p.min_height_mm ?? null
    form.value.max_width_mm = p.max_width_mm ?? null
    form.value.max_height_mm = p.max_height_mm ?? null
    form.value.min_gsm = p.min_gsm ?? null
    form.value.max_gsm = p.max_gsm ?? null
    form.value.default_sheet_size = p.default_sheet_size ?? ''
    form.value.allowed_sheet_sizes_str = Array.isArray(p.allowed_sheet_sizes)
      ? p.allowed_sheet_sizes.join(', ')
      : ''
    form.value.allow_simplex = p.allow_simplex ?? true
    form.value.allow_duplex = p.allow_duplex ?? true
    form.value.default_sides = p.default_sides
    form.value.default_machine = (p as { default_machine?: number | null }).default_machine ?? null
    form.value.is_active = p.is_active
    form.value.finishing_options = (p.finishing_options ?? []).map(fo => ({
      finishing_rate: fo.finishing_rate,
      is_default: fo.is_default ?? false,
      price_adjustment: fo.price_adjustment ?? null,
    }))
    loadExistingImages(p.id)
  } else if (!hasDraft.value) {
    clearDraft()
  }
  showAddCategory.value = false
  loadProductCategories()
  modalOpen.value = true
}

async function loadExistingImages(productId: number) {
  const api = useRawApi()
  try {
    const data = await api<unknown>(API.shopProductImages(props.shopSlug, productId))
    const images = Array.isArray(data) ? data : ((data as Record<string, unknown>)?.results ?? [])
    existingImages.value = images as typeof existingImages.value
  } catch {
    existingImages.value = []
  }
}

function edit(p: Product) {
  openModal(p)
}

async function uploadImages(productId: number) {
  const api = useRawApi()
  for (const imageId of imagesToDelete.value) {
    try {
      await api(API.shopProductImageDetail(props.shopSlug, productId, imageId), { method: 'DELETE' })
    } catch { /* ignore */ }
  }

  for (let i = 0; i < newImageFiles.value.length; i++) {
    const formData = new FormData()
    formData.append('image', newImageFiles.value[i])
    formData.append('display_order', String(existingImages.value.length + i))
    if (existingImages.value.length === 0 && i === 0) {
      formData.append('is_primary', 'true')
    }
    try {
      await api(API.shopProductImages(props.shopSlug, productId), {
        method: 'POST',
        body: formData,
      })
    } catch (e) {
      safeLogError(e, 'SetupProducts.uploadImage')
    }
  }
}

function extractBackendError(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Failed to save product.'
  const o = err as Record<string, unknown>
  if (typeof o.data === 'object' && o.data !== null) {
    const d = o.data as Record<string, unknown>
    if (typeof d.detail === 'string') return d.detail
    if (typeof d.message === 'string') return d.message
    if (Array.isArray(d.detail)) {
      const msgs = (d.detail as Array<{ msg?: string; loc?: unknown }>)
        .map((x) => x.msg ?? (typeof x === 'string' ? x : ''))
        .filter(Boolean)
      if (msgs.length) return msgs.join('; ')
    }
  }
  return err instanceof Error ? err.message : 'Failed to save product.'
}

function normalizeText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value).trim()
  if (Array.isArray(value)) {
    return value.map(item => normalizeText(item)).filter(Boolean).join(', ')
  }
  if (value && typeof value === 'object') {
    const option = value as { value?: unknown; label?: unknown }
    return normalizeText(option.value ?? option.label ?? '')
  }
  return ''
}

async function onSubmit() {
  submitError.value = null
  const slug = props.shopSlug?.trim()
  if (!slug) {
    submitError.value = 'No shop selected. Reload the page and try again.'
    return
  }
  if (props.shopExists === false) {
    submitError.value = 'Shop not found. The URL may be incorrect. Go back to the dashboard and select a shop.'
    return
  }
  saving.value = true
  try {
    const categoryId = typeof form.value.category === 'number' ? form.value.category : null
    const payload: Record<string, unknown> = {
      name: form.value.name.trim(),
      description: form.value.description?.trim() ?? '',
      category: categoryId,
      pricing_mode: form.value.pricing_mode,
      default_finished_width_mm: Number(form.value.default_finished_width_mm) || 90,
      default_finished_height_mm: Number(form.value.default_finished_height_mm) || 54,
      default_bleed_mm: Number(form.value.default_bleed_mm) || 3,
      min_quantity: Math.max(1, Number(form.value.min_quantity) || 1),
      turnaround_days: form.value.turnaround_days ?? null,
      default_sides: form.value.default_sides,
      is_active: form.value.is_active,
      finishing_options: form.value.finishing_options,
    }
    payload.min_width_mm = form.value.min_width_mm ?? null
    payload.min_height_mm = form.value.min_height_mm ?? null
    payload.max_width_mm = form.value.max_width_mm ?? null
    payload.max_height_mm = form.value.max_height_mm ?? null
    payload.default_sheet_size = normalizeText(form.value.default_sheet_size) || null
    const allowedStr = normalizeText(form.value.allowed_sheet_sizes_str)
    payload.allowed_sheet_sizes = allowedStr
      ? allowedStr.split(',').map(s => s.trim()).filter(Boolean)
      : null
    payload.allow_simplex = form.value.allow_simplex
    payload.allow_duplex = form.value.allow_duplex
    payload.min_gsm = form.value.min_gsm ?? null
    payload.max_gsm = form.value.max_gsm ?? null
    payload.default_machine = form.value.default_machine ?? null

    let productId: number
    if (editing.value) {
      const updated = await updateProductBySlug(slug, editing.value.id, payload)
      productId = updated.id
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      const created = await createProductBySlug(slug, payload)
      productId = created.id
      toast.add({ title: 'Added', color: 'success' })
    }

    if (newImageFiles.value.length || imagesToDelete.value.length) {
      await uploadImages(productId)
    }

    clearDraft()
    modalOpen.value = false
    await load()
  } catch (e) {
    const msg = extractBackendError(e)
    submitError.value = msg
    toast.add({ title: 'Error', description: msg, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function confirmDelete(p: Product) {
  if (!confirm(`Delete "${p.name}"?`)) return
  try {
    await deleteProductBySlug(props.shopSlug, p.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

async function loadMachines() {
  if (!props.shopSlug) return
  try {
    const api = useRawApi()
    const data = await api<Array<{ id: number; name: string }> | { results: Array<{ id: number; name: string }> }>(
      API.shopMachines(props.shopSlug)
    )
    shopMachines.value = Array.isArray(data) ? data : (data as { results?: Array<{ id: number; name: string }> }).results ?? []
  } catch {
    shopMachines.value = []
  }
}

watch(
  () => props.shopSlug,
  (slug) => {
    if (slug) {
      load()
      loadFinishingData()
      loadProductCategories()
      loadMachines()
    }
  },
  { immediate: true }
)
</script>
