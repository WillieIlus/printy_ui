<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Machines"
      subtitle="Manage machines here. Add and edit equipment from this page instead of large modals."
    >
      <template #actions>
        <UButton color="primary" @click="openCreatePanel">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          Add Machine
        </UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_24rem]">
      <div class="space-y-4">
        <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-[var(--p-text)]">Machine registry</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">Products, stock fit, and pricing rules should rely on the equipment listed here.</p>
            </div>
            <UBadge :color="activeCount ? 'success' : 'warning'" variant="soft">
              {{ activeCount }} active / {{ items.length }} total
            </UBadge>
          </div>
        </div>

        <DashboardSkeletonState v-if="machineStore.loading && !items.length" variant="cards" :card-count="4" />

        <div v-else-if="items.length" class="grid gap-4 md:grid-cols-2">
          <article
            v-for="machine in items"
            :key="machine.id"
            class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-base font-semibold text-[var(--p-text)]">{{ machine.name }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ machine.machine_type || machine.type_display || 'Machine' }}</p>
              </div>
              <UBadge :color="machine.is_active !== false ? 'success' : 'neutral'" variant="soft">
                {{ machine.is_active !== false ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Sheet Size</p>
                <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ sheetSizeSummary(machine) }}</p>
              </div>
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">GSM Range</p>
                <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ gsmSummary(machine) }}</p>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <UButton variant="soft" size="sm" @click="editMachine(machine)">Edit</UButton>
              <UButton variant="soft" size="sm" color="error" @click="deleteMachine(machine)">Delete</UButton>
            </div>
          </article>
        </div>

        <DashboardEmptyState
          v-else
          title="No machines yet"
          description="Add the presses and finishing equipment this shop actually uses."
          icon="i-lucide-printer"
        >
          <UButton color="primary" @click="openCreatePanel">Add first machine</UButton>
        </DashboardEmptyState>
      </div>

      <DashboardAdminWorkspaceFormPanel
        v-if="panelOpen"
        :title="editing ? 'Edit Machine' : 'Add Machine'"
        :description="editing ? 'Update machine details for this shop.' : 'Create a machine record for this shop.'"
        @close="closePanel"
      >
        <MachinesMachineForm
          :key="editing?.id ?? 'new-machine'"
          :machine="editing"
          :loading="saving"
          :field-errors="fieldErrors"
          :can-add-printing="subscription?.can_add_printing_machine ?? true"
          :can-add-finishing="subscription?.can_add_finishing_machine ?? true"
          @submit="submitMachine"
          @cancel="closePanel"
        />
      </DashboardAdminWorkspaceFormPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Machine } from '~/stores/machine'
import { useNotification } from '~/composables/useNotification'
import { useMachineStore } from '~/stores/machine'
import { useSubscriptionStore } from '~/stores/subscription'
import { extractApiFeedback } from '~/utils/api-feedback'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const notification = useNotification()
const machineStore = useMachineStore()
const subscriptionStore = useSubscriptionStore()

const slug = computed(() => route.params.slug as string)
const panelOpen = ref(false)
const editing = ref<Machine | null>(null)
const saving = ref(false)
const fieldErrors = ref<Record<string, string>>({})

const subscription = computed(() => subscriptionStore.getSubscription(slug.value))
const items = computed(() =>
  [...machineStore.machines].sort((left, right) => left.name.localeCompare(right.name))
)
const activeCount = computed(() => items.value.filter(machine => machine.is_active !== false).length)

function openCreatePanel() {
  editing.value = null
  fieldErrors.value = {}
  panelOpen.value = true
}

function editMachine(machine: Machine) {
  editing.value = machine
  fieldErrors.value = {}
  panelOpen.value = true
}

function closePanel() {
  panelOpen.value = false
  editing.value = null
  fieldErrors.value = {}
}

function sheetSizeSummary(machine: Machine) {
  if (!machine.max_width_mm || !machine.max_height_mm) return 'Not set'
  return `${machine.max_width_mm} x ${machine.max_height_mm} mm`
}

function gsmSummary(machine: Machine) {
  if (machine.min_gsm != null && machine.max_gsm != null) return `${machine.min_gsm}-${machine.max_gsm} gsm`
  if (machine.max_gsm != null) return `Up to ${machine.max_gsm} gsm`
  if (machine.min_gsm != null) return `From ${machine.min_gsm} gsm`
  return 'Not set'
}

async function submitMachine(data: { name: string; machine_type: string; max_width_mm?: number | null; max_height_mm?: number | null; min_gsm?: number | null; max_gsm?: number | null; is_active?: boolean }) {
  saving.value = true
  fieldErrors.value = {}
  try {
    if (editing.value) {
      await machineStore.updateMachine(slug.value, editing.value.id, data)
      notification.success('Machine updated successfully.')
    } else {
      await machineStore.createMachine(slug.value, data)
      notification.success('Machine created successfully.')
    }
    closePanel()
  } catch (error) {
    const feedback = extractApiFeedback(error, 'We could not save this machine right now.')
    fieldErrors.value = feedback.fieldErrors
    notification.error(feedback.message)
  } finally {
    saving.value = false
  }
}

async function deleteMachine(machine: Machine) {
  if (!confirm(`Delete "${machine.name}"?`)) return
  try {
    await machineStore.deleteMachine(slug.value, machine.id)
    notification.success('Machine removed successfully.')
  } catch (error) {
    notification.error(error instanceof Error ? error.message : 'We could not delete this machine right now.')
  }
}

onMounted(async () => {
  await machineStore.fetchMachines(slug.value)
})
</script>
