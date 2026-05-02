<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Papers & materials"
        description="Your paper stocks drive calculator matching and production pricing. Add the papers you actually carry."
        action-label="Add paper"
        @action="openAddForm"
      />

      <div class="flex items-start gap-4 rounded-2xl border border-[var(--p-primary)]/20 bg-[var(--p-primary)]/5 px-5 py-4">
        <div class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--p-primary)]/10 text-[var(--p-primary)]">
          <Icon name="lucide:zap" class="size-4" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-semibold text-[var(--p-text)]">Papers help Printy match your shop to real buyer jobs.</p>
          <p class="text-sm text-[var(--p-text-muted)]">
            The more accurate your papers are, the fewer manual confirmations you need.
          </p>
        </div>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-20 animate-pulse rounded-2xl bg-[var(--p-surface)]" />
      </div>

      <div
        v-else-if="loadError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-5 py-4 text-sm text-[var(--p-error)]"
      >
        <p class="font-semibold">Could not load papers.</p>
        <p class="mt-0.5">{{ loadError }}</p>
        <button class="mt-3 text-xs font-semibold underline" type="button" @click="loadPapers">Retry</button>
      </div>

      <template v-else>
        <div
          v-if="papers.length === 0 && !showForm"
          class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/40 px-8 py-14 text-center"
        >
          <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--p-primary)]/8 text-[var(--p-primary)]">
            <Icon name="lucide:layers" class="size-6" />
          </div>
          <p class="text-base font-semibold text-[var(--p-text)]">Add your first paper</p>
          <p class="mt-2 mx-auto max-w-sm text-sm text-[var(--p-text-muted)]">
            Printy uses this to match buyers to your shop and calculate better quotes.
          </p>
          <BaseButton class="mt-6" variant="primary" size="sm" @click="openAddForm">Add paper</BaseButton>
        </div>

        <div v-else-if="papers.length > 0" class="space-y-3">
          <div
            v-for="paper in papers"
            :key="paper.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4 transition-colors"
            :class="editingPaper?.id === paper.id ? 'border-[var(--p-primary)]/40 bg-[var(--p-primary)]/3' : ''"
          >
            <div v-if="deletingPaperId !== paper.id" class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0 space-y-1.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-semibold text-[var(--p-text)]">{{ paper.display_name || paper.name || generatedName(paper) }}</span>
                  <span class="rounded-full bg-[var(--p-primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--p-primary)]">
                    {{ categoryLabel(paper.category) }}
                  </span>
                  <span
                    class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    :class="paper.is_active ? 'bg-green-500/10 text-green-600' : 'bg-[var(--p-border)] text-[var(--p-text-muted)]'"
                  >
                    {{ paper.is_active ? 'Available' : 'Inactive' }}
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--p-text-muted)]">
                  <span><span class="font-medium text-[var(--p-text)]">{{ paper.gsm }}gsm</span> · {{ paper.sheet_size }}</span>
                  <span>KES <span class="font-medium text-[var(--p-text)]">{{ paper.selling_price }}</span> / sheet</span>
                </div>

                <div class="flex flex-wrap gap-1.5">
                  <span class="rounded-md border border-[var(--p-border)] bg-[var(--p-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--p-text-muted)]">Flat print jobs</span>
                  <span v-if="paper.is_cover_stock" class="rounded-md border border-[var(--p-border)] bg-[var(--p-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--p-text-muted)]">Booklet covers</span>
                  <span v-if="paper.is_insert_stock" class="rounded-md border border-[var(--p-border)] bg-[var(--p-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--p-text-muted)]">Booklet inserts</span>
                  <span v-if="paper.is_sticker_stock" class="rounded-md border border-[var(--p-border)] bg-[var(--p-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--p-text-muted)]">Sticker/label jobs</span>
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <BaseButton variant="secondary" size="sm" @click="openEditForm(paper)">Edit</BaseButton>
                <BaseButton variant="ghost" size="sm" class="text-[var(--p-error)]" @click="deletingPaperId = paper.id">Delete</BaseButton>
              </div>
            </div>

            <div v-else class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm text-[var(--p-text)]">
                Remove <strong>{{ paper.display_name || paper.name || generatedName(paper) }}</strong> permanently?
              </p>
              <div class="flex items-center gap-2">
                <BaseButton variant="ghost" size="sm" :disabled="deleting" @click="deletingPaperId = null">Cancel</BaseButton>
                <BaseButton variant="primary" size="sm" :loading="deleting" class="bg-[var(--p-error)]!" @click="confirmDelete(paper.id)">Yes, remove</BaseButton>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showForm" ref="formPanelRef" class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 md:p-8">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-base font-semibold text-[var(--p-text)]">
              {{ formMode === 'edit' ? 'Edit paper' : 'Add paper' }}
            </h2>
            <button type="button" class="text-[var(--p-text-muted)] hover:text-[var(--p-text)]" @click="closeForm">
              <Icon name="lucide:x" class="size-5" />
            </button>
          </div>

          <form class="space-y-5" novalidate @submit.prevent="submitForm">
            <div
              v-if="formError"
              class="rounded-xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-error)]"
            >
              {{ formError }}
            </div>

            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <BaseSelect
                v-model="form.category"
                label="Category"
                :options="categoryOptions"
                :error="fieldErrors.category"
                required
              />

              <BaseInput
                v-model="form.gsm"
                label="Grammage (GSM)"
                type="number"
                placeholder="e.g. 130"
                :error="fieldErrors.gsm"
                required
              />

              <BaseSelect
                v-model="form.sheet_size"
                label="Sheet size"
                :options="sheetSizeOptions"
              />

              <BaseInput
                v-model="form.buying_price"
                label="Cost price / sheet (KES)"
                type="number"
                placeholder="e.g. 4.50"
                :error="fieldErrors.buying_price"
                required
              />

              <BaseInput
                v-model="form.selling_price"
                label="Selling price / sheet (KES)"
                type="number"
                placeholder="e.g. 7.00"
                :error="fieldErrors.selling_price"
                required
              />
            </div>

            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]/55 p-4">
              <BaseInput
                v-model="form.name"
                label="Custom name (optional)"
                placeholder="e.g. Matt 130gsm, Art Card 300"
                hint="Leave blank - Printy will generate from category and GSM."
              />
              <p class="mt-2 text-xs text-[var(--p-text-muted)]">
                {{ form.name.trim() ? 'Custom label will be used everywhere buyers and staff see this paper.' : `Generated name preview: ${generatedName(form)}` }}
              </p>
            </div>

            <div class="space-y-3">
              <p class="text-sm font-medium text-[var(--p-text)]">Used for</p>
              <div class="flex flex-wrap gap-3">
                <span
                  class="flex items-center gap-2.5 rounded-xl border border-[var(--p-primary)]/40 bg-[var(--p-primary)]/6 px-4 py-2.5 text-sm font-medium text-[var(--p-primary)]"
                  title="All papers support flat print jobs"
                >
                  <Icon name="lucide:check-square" class="size-4 shrink-0" />
                  Flat print jobs
                </span>

                <label
                  v-for="flag in usageFlags"
                  :key="flag.key"
                  class="flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition-colors"
                  :class="form[flag.key as UsageFlagKey]
                    ? 'border-[var(--p-primary)]/40 bg-[var(--p-primary)]/6 font-medium text-[var(--p-primary)]'
                    : 'border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-muted)]'"
                >
                  <input
                    :checked="Boolean(form[flag.key as UsageFlagKey])"
                    type="checkbox"
                    class="sr-only"
                    @change="toggleUsage(flag.key as UsageFlagKey)"
                  />
                  <Icon :name="form[flag.key as UsageFlagKey] ? 'lucide:check-square' : 'lucide:square'" class="size-4 shrink-0" />
                  <span>{{ flag.label }}</span>
                </label>
              </div>
            </div>

            <label class="flex cursor-pointer items-center gap-3">
              <div
                class="relative h-5 w-9 rounded-full transition-colors"
                :class="form.is_active ? 'bg-[var(--p-primary)]' : 'bg-[var(--p-border)]'"
                @click="form.is_active = !form.is_active"
              >
                <div
                  class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                  :class="form.is_active ? 'translate-x-4' : 'translate-x-0.5'"
                />
              </div>
              <span class="text-sm font-medium text-[var(--p-text)]">Available for quoting</span>
            </label>

            <div class="flex items-center gap-3 pt-2">
              <BaseButton type="submit" variant="primary" :loading="submitting">
                {{ formMode === 'edit' ? 'Save changes' : 'Add paper' }}
              </BaseButton>
              <BaseButton type="button" variant="ghost" :disabled="submitting" @click="closeForm">Cancel</BaseButton>
            </div>
          </form>
        </div>
      </template>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import { useNotification } from '~/composables/useNotification'
import { useShopPapers, type ShopPaper, type ShopPaperPayload } from '~/composables/useShopPapers'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'

definePageMeta({ layout: 'dashboard' })

const shopStore = useShopStore()
const setupStatusStore = useSetupStatusStore()
const notification = useNotification()
const shopSlug = computed(() => shopStore.selectedShopSlug)
const { list, create, update, remove } = useShopPapers(shopSlug)

const papers = ref<ShopPaper[]>([])
const loading = ref(false)
const loadError = ref('')

const showForm = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingPaper = ref<ShopPaper | null>(null)
const submitting = ref(false)
const formError = ref('')
const fieldErrors = reactive({
  category: '',
  gsm: '',
  buying_price: '',
  selling_price: '',
})

const deletingPaperId = ref<number | null>(null)
const deleting = ref(false)
const formPanelRef = ref<HTMLElement | null>(null)

const defaultForm = () => ({
  name: '',
  category: 'matt',
  gsm: '' as string | number,
  sheet_size: 'A4',
  buying_price: '' as string | number,
  selling_price: '' as string | number,
  is_cover_stock: false,
  is_insert_stock: false,
  is_sticker_stock: false,
  is_active: true,
})

const form = reactive(defaultForm())

const categoryOptions = [
  { value: 'matt', label: 'Matt' },
  { value: 'gloss', label: 'Gloss' },
  { value: 'bond', label: 'Bond' },
  { value: 'ivory', label: 'Ivory' },
  { value: 'artcard', label: 'Art Card' },
  { value: 'cover_board', label: 'Cover Board' },
  { value: 'tictac', label: 'Tictac' },
  { value: 'conqueror', label: 'Conqueror' },
  { value: 'kraft', label: 'Kraft' },
  { value: 'special', label: 'Special Paper' },
  { value: 'other', label: 'Other' },
]

const sheetSizeOptions = [
  { value: 'A4', label: 'A4 (210 x 297 mm)' },
  { value: 'A3', label: 'A3 (297 x 420 mm)' },
  { value: 'SRA3', label: 'SRA3 (320 x 450 mm)' },
  { value: 'A2', label: 'A2 (420 x 594 mm)' },
  { value: 'A1', label: 'A1 (594 x 841 mm)' },
  { value: 'A0', label: 'A0 (841 x 1189 mm)' },
  { value: 'CUSTOM', label: 'Custom' },
]

const usageFlags = [
  { key: 'is_cover_stock', label: 'Booklet covers' },
  { key: 'is_insert_stock', label: 'Booklet inserts' },
  { key: 'is_sticker_stock', label: 'Sticker/label jobs' },
] as const

type UsageFlagKey = (typeof usageFlags)[number]['key']

function categoryLabel(value: string): string {
  return categoryOptions.find(option => option.value === value)?.label ?? value
}

function generatedName(paper: Pick<ShopPaper, 'category' | 'gsm'> | { category: string, gsm: string | number }): string {
  const gsm = Number(paper.gsm)
  return gsm > 0 ? `${categoryLabel(paper.category)} ${gsm}gsm` : `${categoryLabel(paper.category)} paper`
}

function sortPapers(items: ShopPaper[]): ShopPaper[] {
  return [...items].sort((a, b) => {
    if (a.is_active !== b.is_active) return Number(b.is_active) - Number(a.is_active)
    return (a.display_name || a.name || generatedName(a)).localeCompare(b.display_name || b.name || generatedName(b))
  })
}

function resetFieldErrors() {
  fieldErrors.category = ''
  fieldErrors.gsm = ''
  fieldErrors.buying_price = ''
  fieldErrors.selling_price = ''
}

function validateForm(): boolean {
  resetFieldErrors()
  let valid = true

  if (!form.category) {
    fieldErrors.category = 'Select a category.'
    valid = false
  }
  if (!form.gsm || Number(form.gsm) <= 0) {
    fieldErrors.gsm = 'Enter a valid GSM (e.g. 130).'
    valid = false
  }
  if (!form.buying_price || Number(form.buying_price) <= 0) {
    fieldErrors.buying_price = 'Enter cost price per sheet.'
    valid = false
  }
  if (!form.selling_price || Number(form.selling_price) <= 0) {
    fieldErrors.selling_price = 'Enter selling price per sheet.'
    valid = false
  }

  return valid
}

function toggleUsage(key: UsageFlagKey) {
  form[key] = !form[key]
}

async function loadPapers() {
  loading.value = true
  loadError.value = ''
  try {
    papers.value = sortPapers(await list())
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load papers.'
  } finally {
    loading.value = false
  }
}

async function refreshSetupStatus() {
  if (!shopSlug.value) return
  try {
    await setupStatusStore.fetchStatus(shopSlug.value)
  } catch {
    // Keep the page usable even if setup refresh fails.
  }
}

function openAddForm() {
  Object.assign(form, defaultForm())
  editingPaper.value = null
  formMode.value = 'add'
  formError.value = ''
  resetFieldErrors()
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function openEditForm(paper: ShopPaper) {
  Object.assign(form, {
    name: paper.name || '',
    category: paper.category,
    gsm: paper.gsm,
    sheet_size: paper.sheet_size,
    buying_price: paper.buying_price,
    selling_price: paper.selling_price,
    is_cover_stock: paper.is_cover_stock,
    is_insert_stock: paper.is_insert_stock,
    is_sticker_stock: paper.is_sticker_stock,
    is_active: paper.is_active,
  })
  editingPaper.value = paper
  formMode.value = 'edit'
  formError.value = ''
  resetFieldErrors()
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function closeForm() {
  showForm.value = false
  editingPaper.value = null
  formMode.value = 'add'
}

async function submitForm() {
  if (!validateForm()) return

  formError.value = ''
  submitting.value = true

  const payload: ShopPaperPayload = {
    name: form.name.trim() || undefined,
    category: form.category,
    gsm: Number(form.gsm),
    sheet_size: form.sheet_size,
    buying_price: Number(form.buying_price),
    selling_price: Number(form.selling_price),
    is_cover_stock: form.is_cover_stock,
    is_insert_stock: form.is_insert_stock,
    is_sticker_stock: form.is_sticker_stock,
    is_active: form.is_active,
  }

  try {
    if (formMode.value === 'edit' && editingPaper.value) {
      await update(editingPaper.value.id, payload)
      notification.success('Paper updated.', 'Saved')
    } else {
      await create(payload)
      notification.success('Paper added.', 'Added')
    }

    await Promise.all([loadPapers(), refreshSetupStatus()])
    closeForm()
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function confirmDelete(id: number) {
  deleting.value = true
  try {
    await remove(id)
    await Promise.all([loadPapers(), refreshSetupStatus()])
    notification.success('Paper removed.', 'Removed')
  } catch {
    notification.error('Could not remove paper. Try again.', 'Paper removal failed')
  } finally {
    deleting.value = false
    deletingPaperId.value = null
  }
}

onMounted(loadPapers)
watch(shopSlug, loadPapers)
</script>
