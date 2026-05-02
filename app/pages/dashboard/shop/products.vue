<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Products"
        description="Products define your turnaround times and production settings. Add at least one to complete setup."
        action-label="Add product"
        @action="openAddForm"
      />

      <!-- Info card -->
      <div class="flex items-start gap-4 rounded-2xl border border-[var(--p-primary)]/20 bg-[var(--p-primary)]/5 px-5 py-4">
        <div class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--p-primary)]/10 text-[var(--p-primary)]">
          <Icon name="lucide:clock" class="size-4" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-semibold text-[var(--p-text)]">Products set your turnaround expectations.</p>
          <p class="text-sm text-[var(--p-text-muted)]">
            Each product holds standard and rush turnaround hours. Buyers see this when requesting a quote.
            You need at least one active product with a turnaround to complete shop setup.
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-20 animate-pulse rounded-2xl bg-[var(--p-surface)]" />
      </div>

      <!-- Error -->
      <div
        v-else-if="loadError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-5 py-4 text-sm text-[var(--p-error)]"
      >
        <p class="font-semibold">Could not load products.</p>
        <p class="mt-0.5">{{ loadError }}</p>
        <button class="mt-3 text-xs font-semibold underline" type="button" @click="loadProducts">Retry</button>
      </div>

      <template v-else>
        <!-- Empty state -->
        <div
          v-if="products.length === 0 && !showForm"
          class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/40 px-8 py-14 text-center"
        >
          <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--p-primary)]/8 text-[var(--p-primary)]">
            <Icon name="lucide:package" class="size-6" />
          </div>
          <p class="text-base font-semibold text-[var(--p-text)]">Add your first product</p>
          <p class="mt-2 max-w-sm mx-auto text-sm text-[var(--p-text-muted)]">
            Products set turnaround expectations for buyers requesting quotes.
          </p>
          <BaseButton class="mt-6" variant="primary" size="sm" @click="openAddForm">Add product</BaseButton>
        </div>

        <!-- Products list -->
        <div v-else-if="products.length > 0" class="space-y-3">
          <div
            v-for="product in products"
            :key="product.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4"
            :class="editingProduct?.id === product.id ? 'border-[var(--p-primary)]/40 bg-[var(--p-primary)]/3' : ''"
          >
            <div
              v-if="deletingId !== product.id"
              class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="min-w-0 space-y-1.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-semibold text-[var(--p-text)]">{{ product.name }}</span>
                  <span
                    class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    :class="product.is_active ? 'bg-green-500/10 text-green-600' : 'bg-[var(--p-border)] text-[var(--p-text-muted)]'"
                  >
                    {{ product.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <span
                    v-if="product.status"
                    class="rounded-full border border-[var(--p-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--p-text-muted)]"
                  >
                    {{ product.status }}
                  </span>
                </div>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--p-text-muted)]">
                  <span v-if="product.turnaround_days">
                    <span class="font-medium text-[var(--p-text)]">{{ product.turnaround_days }}</span> day{{ product.turnaround_days !== 1 ? 's' : '' }} turnaround
                  </span>
                  <span v-else-if="product.standard_turnaround_hours">
                    <span class="font-medium text-[var(--p-text)]">{{ product.standard_turnaround_hours }}</span>h standard turnaround
                  </span>
                  <span v-else class="italic">No turnaround set</span>
                  <span v-if="product.rush_turnaround_hours">
                    · <span class="font-medium text-[var(--p-text)]">{{ product.rush_turnaround_hours }}</span>h rush
                  </span>
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <BaseButton variant="secondary" size="sm" @click="openEditForm(product)">Edit</BaseButton>
                <BaseButton variant="ghost" size="sm" class="text-[var(--p-error)]" @click="deletingId = product.id">Delete</BaseButton>
              </div>
            </div>

            <!-- Delete confirmation -->
            <div v-else class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm text-[var(--p-text)]">Remove <strong>{{ product.name }}</strong> permanently?</p>
              <div class="flex items-center gap-2">
                <BaseButton variant="ghost" size="sm" :disabled="deleting" @click="deletingId = null">Cancel</BaseButton>
                <BaseButton variant="primary" size="sm" :loading="deleting" class="bg-[var(--p-error)]!" @click="confirmDelete(product.id)">
                  Yes, remove
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Add / Edit form -->
        <div v-if="showForm" ref="formPanelRef" class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 md:p-8">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-base font-semibold text-[var(--p-text)]">
              {{ formMode === 'edit' ? 'Edit product' : 'Add product' }}
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

            <div class="grid gap-5 sm:grid-cols-2">
              <BaseInput
                v-model="form.name"
                label="Product name"
                placeholder="e.g. Business Cards, Flyers, Booklets"
                :error="fieldErrors.name"
                required
              />
              <BaseInput
                v-model="form.turnaround_days"
                label="Turnaround (days)"
                type="number"
                placeholder="e.g. 2"
                hint="Standard calendar days to complete the job."
              />
              <BaseInput
                v-model="form.standard_turnaround_hours"
                label="Standard turnaround (hours)"
                type="number"
                placeholder="e.g. 48"
                hint="Working hours for standard completion."
              />
              <BaseInput
                v-model="form.rush_turnaround_hours"
                label="Rush turnaround (hours)"
                type="number"
                placeholder="e.g. 24"
                hint="Leave blank if rush is not offered."
              />
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
              <span class="text-sm font-medium text-[var(--p-text)]">Active</span>
            </label>

            <div class="flex items-center gap-3 pt-2">
              <BaseButton type="submit" variant="primary" :loading="submitting">
                {{ formMode === 'edit' ? 'Save changes' : 'Add product' }}
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
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import { useShopStore } from '~/stores/shop'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useNotification } from '~/composables/useNotification'
import { API } from '~/shared/api-paths'

definePageMeta({ layout: 'dashboard' })

const shopStore = useShopStore()
const setupStatusStore = useSetupStatusStore()
const notification = useNotification()
const { $api } = useNuxtApp()

const shopSlug = computed(() => shopStore.selectedShopSlug)

interface ShopProduct {
  id: number
  name: string
  is_active: boolean
  is_public?: boolean
  status?: string
  turnaround_days?: number | null
  standard_turnaround_hours?: number | null
  rush_turnaround_hours?: number | null
}

const products = ref<ShopProduct[]>([])
const loading = ref(false)
const loadError = ref('')

const showForm = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingProduct = ref<ShopProduct | null>(null)
const submitting = ref(false)
const formError = ref('')
const fieldErrors = reactive({ name: '' })

const deletingId = ref<number | null>(null)
const deleting = ref(false)

const formPanelRef = ref<HTMLElement | null>(null)

const defaultForm = () => ({
  name: '',
  turnaround_days: '' as string | number,
  standard_turnaround_hours: '' as string | number,
  rush_turnaround_hours: '' as string | number,
  is_active: true,
})

const form = reactive(defaultForm())

async function loadProducts() {
  const slug = shopSlug.value
  if (!slug) return
  loading.value = true
  loadError.value = ''
  try {
    const data = await $api<ShopProduct[] | { results: ShopProduct[] }>(API.shopProducts(slug))
    products.value = Array.isArray(data) ? data : (data.results ?? [])
  }
  catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load products.'
  }
  finally {
    loading.value = false
  }
}

function openAddForm() {
  Object.assign(form, defaultForm())
  editingProduct.value = null
  formMode.value = 'add'
  formError.value = ''
  fieldErrors.name = ''
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function openEditForm(product: ShopProduct) {
  Object.assign(form, {
    name: product.name,
    turnaround_days: product.turnaround_days ?? '',
    standard_turnaround_hours: product.standard_turnaround_hours ?? '',
    rush_turnaround_hours: product.rush_turnaround_hours ?? '',
    is_active: product.is_active,
  })
  editingProduct.value = product
  formMode.value = 'edit'
  formError.value = ''
  fieldErrors.name = ''
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function closeForm() {
  showForm.value = false
  editingProduct.value = null
  formMode.value = 'add'
}

function buildPayload() {
  const payload: Record<string, unknown> = {
    name: form.name.trim(),
    is_active: form.is_active,
    pricing_mode: 'CALCULATED',
  }
  if (form.turnaround_days !== '' && form.turnaround_days != null)
    payload.turnaround_days = Number(form.turnaround_days)
  if (form.standard_turnaround_hours !== '' && form.standard_turnaround_hours != null)
    payload.standard_turnaround_hours = Number(form.standard_turnaround_hours)
  if (form.rush_turnaround_hours !== '' && form.rush_turnaround_hours != null)
    payload.rush_turnaround_hours = Number(form.rush_turnaround_hours)
  return payload
}

async function submitForm() {
  fieldErrors.name = ''
  if (!form.name.trim()) { fieldErrors.name = 'Product name is required.'; return }
  formError.value = ''
  submitting.value = true
  const slug = shopSlug.value
  if (!slug) return
  try {
    if (formMode.value === 'edit' && editingProduct.value) {
      const updated = await $api<ShopProduct>(API.shopProductDetail(slug, editingProduct.value.id), {
        method: 'PATCH',
        body: buildPayload(),
      })
      const idx = products.value.findIndex(p => p.id === updated.id)
      if (idx >= 0) products.value[idx] = updated
      notification.success('Product updated.', 'Saved')
    }
    else {
      const created = await $api<ShopProduct>(API.shopProducts(slug), {
        method: 'POST',
        body: buildPayload(),
      })
      products.value.unshift(created)
      notification.success('Product added.', 'Added')
    }
    await setupStatusStore.fetchStatus(slug).catch(() => {})
    closeForm()
  }
  catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
  }
  finally {
    submitting.value = false
  }
}

async function confirmDelete(id: number) {
  const slug = shopSlug.value
  if (!slug) return
  deleting.value = true
  try {
    await $api(API.shopProductDetail(slug, id), { method: 'DELETE' })
    products.value = products.value.filter(p => p.id !== id)
    await setupStatusStore.fetchStatus(slug).catch(() => {})
    notification.success('Product removed.', 'Removed')
  }
  catch {
    notification.error('Could not remove product. Try again.', 'Product removal failed')
  }
  finally {
    deleting.value = false
    deletingId.value = null
  }
}

onMounted(loadProducts)
watch(shopSlug, loadProducts)
</script>
