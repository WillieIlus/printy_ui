<template>
  <CommonSimpleModal
    :open="open"
    title="Upgrade plan"
    description="Pay via M-Pesa to unlock more machines."
    @update:open="$emit('update:open', $event)"
  >
    <div class="space-y-4">
      <p v-if="reason" class="text-sm text-amber-600 dark:text-amber-400">
        {{ reason }}
      </p>

      <div v-if="!paymentId" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select plan
          </label>
          <select
            v-model="selectedPlanId"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
            :disabled="!plans.length"
          >
            <option v-if="!plans.length" value="">No plans available</option>
            <option v-for="p in plans" :key="p.id" :value="p.id">
              {{ p.name }} — KES {{ p.price }}/{{ (p.billing_period ?? 'MONTHLY').toLowerCase() }}
              ({{ p.max_printing_machines || '∞' }} printing, {{ p.max_finishing_machines || '∞' }} finishing)
            </option>
          </select>
          <p v-if="!plans.length" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Plans could not be loaded. Check your connection and try again.
          </p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            M-Pesa phone number
          </label>
          <input
            v-model="phone"
            type="tel"
            placeholder="0712345678"
            class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
          />
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <UButton variant="outline" @click="$emit('update:open', false)">Cancel</UButton>
          <UButton
            class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
            :loading="initiating"
            :disabled="!selectedPlanId || !phone.trim() || initiating || !plans.length"
            @click="initiatePayment"
          >
            Pay via M-Pesa
          </UButton>
        </div>
      </div>

      <div v-else class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Complete payment on your phone. Waiting for confirmation...
        </p>
        <div class="flex justify-center">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-flamingo-500" />
        </div>
        <p v-if="paymentFailed" class="text-sm text-red-600 dark:text-red-400">
          Payment failed or was cancelled.
        </p>
      </div>
    </div>
  </CommonSimpleModal>
</template>

<script setup lang="ts">
import type { SubscriptionPlanInfo } from '~/stores/subscription'
import { useSubscriptionStore } from '~/stores/subscription'
import { API } from '~/shared/api-paths'

const props = defineProps<{
  open: boolean
  shopSlug: string
  reason?: string
  plans: SubscriptionPlanInfo[]
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const subscriptionStore = useSubscriptionStore()
const toast = useToast()

const selectedPlanId = ref<number | null>(null)
const phone = ref('')
const initiating = ref(false)
const paymentId = ref<number | null>(null)
const paymentFailed = ref(false)
let pollInterval: ReturnType<typeof setInterval> | null = null

watch(() => props.open, (open) => {
  if (open) {
    selectedPlanId.value = props.plans[0]?.id ?? null
    phone.value = ''
    paymentId.value = null
    paymentFailed.value = false
  } else {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }
})

watch(() => props.plans, (plans) => {
  if (plans.length && !selectedPlanId.value) {
    selectedPlanId.value = plans[0].id
  }
}, { immediate: true })

async function initiatePayment() {
  if (!selectedPlanId.value || !phone.value.trim()) return
  initiating.value = true
  try {
    const { $api } = useNuxtApp()
    const res = await $api<{ id: number; message: string }>(API.shopStkPush(props.shopSlug), {
      method: 'POST',
      body: { plan_id: selectedPlanId.value, phone: phone.value.trim() },
    })
    paymentId.value = res.id
    toast.add({ title: 'Check your phone', description: res.message })
    startPolling()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to initiate payment'
    toast.add({ title: 'Error', description: msg, color: 'error' })
  } finally {
    initiating.value = false
  }
}

function startPolling() {
  if (pollInterval) clearInterval(pollInterval)
  pollInterval = setInterval(async () => {
    if (!paymentId.value) return
    try {
      const { $api } = useNuxtApp()
      const res = await $api<{ status: string }>(API.paymentStatus(paymentId.value))
      if (res.status === 'SUCCESS') {
        if (pollInterval) {
          clearInterval(pollInterval)
          pollInterval = null
        }
        await subscriptionStore.fetchSubscription(props.shopSlug)
        toast.add({ title: 'Payment successful', description: 'Your plan has been upgraded.' })
        paymentId.value = null
        emit('update:open', false)
      } else if (['FAILED', 'CANCELLED', 'TIMEOUT'].includes(res.status)) {
        if (pollInterval) {
          clearInterval(pollInterval)
          pollInterval = null
        }
        paymentFailed.value = true
      }
    } catch {
      // ignore poll errors
    }
  }, 3000)
}
</script>
