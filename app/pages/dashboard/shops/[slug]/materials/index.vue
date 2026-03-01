<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Paper stock & materials</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Track paper inventory by size, GSM and type. Adjust stock levels as you use or receive stock.
        </p>
      </div>
      <div class="flex gap-2">
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
        <UButton
          type="button"
          class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
          @click="openModal()"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add paper stock
        </UButton>
      </div>
    </div>

    <CommonLoadingSpinner v-if="paperStockStore.loading && !paperStockStore.items.length" />
    <template v-else>
      <div v-if="paperStockStore.items.length" class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paper</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">In stock</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reorder at</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy / Sell</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="item in paperStockStore.items"
              :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="px-4 py-3">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ item.sheet_size_display ?? item.sheet_size }} {{ item.gsm }}gsm
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ item.paper_type_display ?? item.paper_type }}
                </div>
              </td>
              <td class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                {{ item.quantity_in_stock != null ? `${item.quantity_in_stock} sheets` : '-' }}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                {{ item.reorder_level ?? '-' }}
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                KES {{ item.buying_price }} / KES {{ item.selling_price }}
              </td>
              <td class="px-4 py-3 text-center">
                <UBadge
                  :color="(item.needs_reorder ?? (item.quantity_in_stock != null && item.reorder_level != null && item.quantity_in_stock <= item.reorder_level)) ? 'error' : 'success'"
                  variant="soft"
                  size="xs"
                >
                  {{ (item.needs_reorder ?? (item.quantity_in_stock != null && item.reorder_level != null && item.quantity_in_stock <= item.reorder_level)) ? 'Low stock' : 'OK' }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-right">
                <UButton
                  v-if="item.quantity_in_stock != null"
                  variant="ghost"
                  size="xs"
                  @click="openAdjustModal(item)"
                >
                  <UIcon name="i-lucide-plus-minus" class="w-4 h-4" />
                </UButton>
                <UButton variant="ghost" size="xs" @click="editItem(item)">Edit</UButton>
                <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(item)">
                  Delete
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CommonEmptyState
        v-else
        title="No paper stock yet"
        description="Add your first paper stock entry. Track inventory by size, GSM and paper type."
      >
        <UButton type="button" class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openModal()">
          Add first paper stock
        </UButton>
      </CommonEmptyState>
    </template>

    <DashboardModalForm
      v-model="modalOpen"
      :title="editing ? 'Edit paper stock' : 'Add paper stock'"
      :description="editing ? 'Edit paper inventory details.' : 'Add paper inventory by size, GSM and type.'"
    >
      <MaterialsPaperStockForm
        v-if="formReady"
        :key="editing?.id ?? 'new'"
        :stock="editing"
        :loading="formLoading"
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </DashboardModalForm>

    <DashboardModalForm
      v-model="adjustModalOpen"
      title="Adjust stock"
      description="Add or remove sheets from inventory."
    >
        <div v-if="adjustingItem" class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ adjustingItem.sheet_size }} {{ adjustingItem.gsm }}gsm {{ adjustingItem.paper_type }}
            — current: {{ adjustingItem.quantity_in_stock ?? 0 }} sheets
          </p>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Adjustment (+ to add, - to remove)
            </label>
            <input
              v-model="adjustmentValue"
              type="number"
              placeholder="e.g. 50 or -20"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
            />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <UButton variant="outline" @click="closeAdjustModal">Cancel</UButton>
            <UButton
              class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
              :loading="adjustLoading"
              :disabled="adjustLoading || adjustmentValue === '' || adjustmentValue === null"
              @click="applyAdjustment"
            >
              Apply
            </UButton>
          </div>
        </div>
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import type { Paper } from '~/stores/paperStock'
import { usePaperStockStore } from '~/stores/paperStock'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const paperStockStore = usePaperStockStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)
const modalOpen = ref(false)
const formReady = ref(false)
const editing = ref<Paper | null>(null)
const formLoading = ref(false)
const adjustModalOpen = ref(false)
const adjustingItem = ref<Paper | null>(null)
const adjustmentValue = ref<string>('')
const adjustLoading = ref(false)

function openModal(item?: Paper) {
  editing.value = item ?? null
  modalOpen.value = true
}

function editItem(item: Paper) {
  openModal(item)
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

watch(modalOpen, (open) => {
  if (open) {
    formReady.value = false
    nextTick(() => { formReady.value = true })
  } else {
    formReady.value = false
    editing.value = null
  }
})

function openAdjustModal(item: Paper) {
  adjustingItem.value = item
  adjustmentValue.value = ''
  adjustModalOpen.value = true
}

function closeAdjustModal() {
  adjustModalOpen.value = false
  adjustingItem.value = null
  adjustmentValue.value = ''
}

async function onSubmit(data: {
  sheet_size: string
  gsm: number
  paper_type: string
  buying_price: string
  selling_price: string
  quantity_in_stock?: number | null
  reorder_level?: number | null
}) {
  formLoading.value = true
  try {
    const payload = {
      sheet_size: data.sheet_size,
      gsm: data.gsm,
      paper_type: data.paper_type,
      buying_price: data.buying_price,
      selling_price: data.selling_price,
      quantity_in_stock: data.quantity_in_stock ?? null,
      reorder_level: data.reorder_level ?? null,
    }
    if (editing.value) {
      await paperStockStore.updatePaperStock(slug.value, editing.value.id, payload)
      toast.add({ title: 'Updated', description: 'Paper stock updated' })
    } else {
      await paperStockStore.createPaperStock(slug.value, payload)
      toast.add({ title: 'Added', description: 'Paper stock added' })
    }
    closeModal()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : paperStockStore.error ?? 'Failed to save'
    toast.add({ title: 'Error', description: msg, color: 'error' })
  } finally {
    formLoading.value = false
  }
}

async function applyAdjustment() {
  if (!adjustingItem.value) return
  const adj = parseInt(adjustmentValue.value, 10)
  if (Number.isNaN(adj) || adj === 0 || adjustmentValue.value.trim() === '') {
    toast.add({ title: 'Invalid', description: 'Enter a non-zero number', color: 'error' })
    return
  }
  adjustLoading.value = true
  try {
    await paperStockStore.adjustStock(slug.value, adjustingItem.value.id, adj)
    toast.add({
      title: 'Stock updated',
      description: adj > 0 ? `Added ${adj} sheets` : `Removed ${Math.abs(adj)} sheets`,
    })
    closeAdjustModal()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : paperStockStore.error ?? 'Failed to adjust'
    toast.add({ title: 'Error', description: msg, color: 'error' })
  } finally {
    adjustLoading.value = false
  }
}

async function confirmDelete(item: Paper) {
  const name = `${item.sheet_size} ${item.gsm}gsm ${item.paper_type}`
  if (!confirm(`Delete "${name}"? This may affect quotes using this stock.`)) return
  try {
    await paperStockStore.deletePaperStock(slug.value, item.id)
    toast.add({ title: 'Deleted', description: 'Paper stock removed' })
  } catch (err: unknown) {
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to delete',
      color: 'error',
    })
  }
}

onMounted(async () => {
  await paperStockStore.fetchPaperStock(slug.value)
})
</script>
