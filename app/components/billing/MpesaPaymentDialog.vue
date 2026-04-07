<template>
  <UModal v-model:open="open" :dismissible="!polling">
    <template #content>
      <div class="w-full max-w-md rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-2xl">

        <!-- SUCCESS -->
        <div v-if="phase === 'success'" class="flex flex-col items-center text-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <UIcon name="i-lucide-check-circle-2" class="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-[var(--p-text)]">Payment confirmed</h2>
            <p class="mt-1.5 text-sm text-[var(--p-text-muted)]">Your subscription is now active. Welcome to {{ planName }}!</p>
          </div>
          <button
            type="button"
            class="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
            @click="$emit('done')"
          >
            Continue
          </button>
        </div>

        <!-- FAILED -->
        <div v-else-if="phase === 'failed'" class="flex flex-col items-center text-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <UIcon name="i-lucide-x-circle" class="h-9 w-9 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-[var(--p-text)]">Payment failed</h2>
            <p class="mt-1.5 text-sm text-[var(--p-text-muted)]">
              {{ failureMessage || 'We could not complete the payment. Try again.' }}
            </p>
          </div>
          <div class="flex w-full flex-col gap-2">
            <button
              type="button"
              class="w-full rounded-xl bg-[var(--color-primary-600)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--color-primary-500)] transition-colors"
              @click="$emit('retry')"
            >
              Try again
            </button>
            <button
              type="button"
              class="w-full rounded-xl border border-[var(--p-border)] px-5 py-3 text-sm font-medium text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] transition-colors"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- PHONE INPUT (initial state) -->
        <div v-else-if="phase === 'input'">
          <div class="mb-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-600)]/10 mb-4">
              <UIcon name="i-lucide-smartphone" class="h-6 w-6 text-[var(--color-primary-600)]" />
            </div>
            <h2 class="text-lg font-bold text-[var(--p-text)]">Pay with M-PESA</h2>
            <p class="mt-1.5 text-sm text-[var(--p-text-dim)]">
              You'll receive an STK push prompt on your phone.
              Enter your M-PESA PIN to confirm.
            </p>
          </div>

          <!-- Plan summary -->
          <div class="mb-5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-[var(--p-text-muted)]">{{ intervalLabel }}</p>
                <p class="text-base font-bold text-[var(--p-text)]">{{ planName }}</p>
              </div>
              <p class="text-xl font-extrabold text-[var(--p-text)]">{{ amount }}</p>
            </div>
          </div>

          <!-- Phone number input -->
          <div class="mb-5">
            <label class="mb-1.5 block text-sm font-semibold text-[var(--p-text)]">
              M-PESA phone number
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <span class="text-sm font-semibold text-[var(--p-text-muted)]">🇰🇪 +254</span>
              </div>
              <input
                v-model="localPhone"
                type="tel"
                inputmode="numeric"
                placeholder="7XX XXX XXX"
                maxlength="12"
                class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] py-3 pl-20 pr-4 text-sm font-medium text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]/20"
                :class="phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''"
              />
            </div>
            <p v-if="phoneError" class="mt-1.5 text-xs text-red-600 dark:text-red-400">{{ phoneError }}</p>
          </div>

          <!-- Shop selection (if needed) -->
          <div v-if="shops?.length && showShopSelection" class="mb-5">
            <label class="mb-1.5 block text-sm font-semibold text-[var(--p-text)]">
              Select shops ({{ shopLimit }} allowed)
            </label>
            <div class="flex flex-col gap-2">
              <label
                v-for="shop in shops"
                :key="shop.id"
                class="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--p-border)] p-3 transition-colors"
                :class="selectedShopIds.includes(shop.id)
                  ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-600)]/5'
                  : 'hover:bg-[var(--p-surface-sunken)]'"
              >
                <input
                  type="checkbox"
                  class="accent-[var(--color-primary-600)]"
                  :value="shop.id"
                  :checked="selectedShopIds.includes(shop.id)"
                  @change="toggleShop(shop.id)"
                />
                <span class="flex items-center gap-2 text-sm font-medium text-[var(--p-text)]">
                  <UIcon name="i-lucide-store" class="h-4 w-4 text-[var(--p-text-muted)]" />
                  {{ shop.name }}
                </span>
              </label>
            </div>
            <p v-if="shopError" class="mt-1.5 text-xs text-red-600">{{ shopError }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <button
              type="button"
              class="w-full rounded-xl bg-[var(--color-primary-600)] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[var(--color-primary-500)] transition-colors disabled:opacity-60"
              :disabled="submitting"
              @click="handleSubmit"
            >
              <span v-if="submitting" class="flex items-center justify-center gap-2">
                <UIcon name="i-lucide-loader-circle" class="h-4 w-4 animate-spin" />
                Sending request…
              </span>
              <span v-else>Send M-PESA request</span>
            </button>
            <button
              type="button"
              class="w-full rounded-xl border border-[var(--p-border)] px-5 py-3 text-sm font-medium text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] transition-colors"
              :disabled="submitting"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- PENDING / AWAITING PIN -->
        <div v-else class="flex flex-col items-center text-center gap-5">
          <div class="relative flex h-20 w-20 items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-[var(--color-primary-600)]/10 animate-ping" />
            <div class="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-600)]/15">
              <UIcon name="i-lucide-smartphone" class="h-10 w-10 text-[var(--color-primary-600)]" />
            </div>
          </div>

          <div>
            <h2 class="text-xl font-bold text-[var(--p-text)]">Check your phone</h2>
            <p class="mt-2 text-sm leading-6 text-[var(--p-text-dim)]">
              Enter your M-PESA PIN on your phone to complete the payment.
            </p>
            <p class="mt-1 text-xs text-[var(--p-text-muted)]">
              Waiting for confirmation…
            </p>
          </div>

          <div class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3">
            <p class="text-xs text-[var(--p-text-muted)]">Amount</p>
            <p class="text-lg font-bold text-[var(--p-text)]">{{ amount }}</p>
            <p v-if="localPhone" class="mt-0.5 text-xs text-[var(--p-text-muted)]">To: {{ maskedPhone }}</p>
          </div>

          <p class="text-xs text-[var(--p-text-muted)]">
            Didn't receive a prompt?
            <button type="button" class="font-semibold text-[var(--color-primary-600)] hover:underline" @click="phase = 'input'">
              Try again
            </button>
          </p>
        </div>

      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { BillingInterval } from '~/shared/types/billing'

interface ShopOption {
  id: number
  name: string
}

const props = defineProps<{
  planName: string
  amount: string
  interval: BillingInterval
  shops?: ShopOption[]
  shopLimit?: number
  showShopSelection?: boolean
  polling?: boolean
  submitting?: boolean
  failureMessage?: string
}>()

const emit = defineEmits<{
  (e: 'submit', phone: string, shopIds: number[]): void
  (e: 'retry'): void
  (e: 'cancel'): void
  (e: 'done'): void
}>()

const open = defineModel<boolean>({ default: false })
const phase = defineModel<'input' | 'pending' | 'success' | 'failed'>('phase', { default: 'input' })

const localPhone = ref('')
const phoneError = ref('')
const shopError = ref('')
const selectedShopIds = ref<number[]>([])

const intervalLabel = computed(() =>
  props.interval === 'annual' ? 'Annual billing' : 'Monthly billing',
)

const maskedPhone = computed(() => {
  const p = localPhone.value.replace(/\D/g, '')
  if (p.length < 4) return p
  return `**** **** ${p.slice(-3)}`
})

function toggleShop(id: number) {
  const idx = selectedShopIds.value.indexOf(id)
  if (idx > -1) {
    selectedShopIds.value.splice(idx, 1)
  } else {
    const limit = props.shopLimit ?? 1
    if (selectedShopIds.value.length >= limit) {
      shopError.value = `You can only select ${limit} shop(s) for this plan.`
      return
    }
    selectedShopIds.value.push(id)
    shopError.value = ''
  }
}

function validatePhone(): boolean {
  const digits = localPhone.value.replace(/\D/g, '')
  const full = digits.startsWith('0') ? `254${digits.slice(1)}` : digits.startsWith('7') ? `254${digits}` : digits
  if (!/^2547\d{8}$/.test(full)) {
    phoneError.value = 'Enter a valid Kenyan phone number (e.g. 0712 345 678)'
    return false
  }
  phoneError.value = ''
  return true
}

function handleSubmit() {
  if (!validatePhone()) return
  if (props.showShopSelection && selectedShopIds.value.length === 0) {
    shopError.value = 'Please select at least one shop.'
    return
  }
  shopError.value = ''
  const digits = localPhone.value.replace(/\D/g, '')
  const normalized = digits.startsWith('0') ? `254${digits.slice(1)}` : digits.startsWith('7') ? `254${digits}` : digits
  emit('submit', normalized, selectedShopIds.value)
}

// Reset on close
watch(open, (v) => {
  if (!v) {
    if (phase.value !== 'success') {
      phase.value = 'input'
    }
    phoneError.value = ''
    shopError.value = ''
  }
})
</script>
