<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden @click="close" />
        <div
          class="modal-panel relative z-[100010] w-full max-w-md overflow-hidden rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-lg"
          @click.stop
        >
          <div class="border-b border-[var(--p-border)] px-5 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-semibold text-[var(--p-text)] sm:text-lg">Sign in to submit your quote request</h2>
              <button
                type="button"
                class="rounded-md p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]"
                @click="close"
              >
                <UIcon name="i-lucide-x" class="h-5 w-5" />
              </button>
            </div>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">
              By submitting, you create an account. We'll use your email to send the quote.
            </p>
          </div>

          <div class="space-y-4 p-5 sm:p-6">
            <UAlert
              v-if="error"
              color="error"
              icon="i-lucide-alert-circle"
              :title="error"
              class="rounded-md"
              close
              @update:open="(o: boolean) => { if (!o) error = '' }"
            />

            <!-- Sign in form -->
            <form v-if="mode === 'signin'" class="space-y-4" @submit.prevent="onSignIn">
              <UFormField label="Email">
                <UInput v-model="signInEmail" type="email" placeholder="you@example.com" required />
              </UFormField>
              <UFormField label="Password">
                <UInput v-model="signInPassword" type="password" placeholder="••••••••" required />
              </UFormField>
              <UButton type="submit" color="primary" block :loading="loading">
                Sign in and submit
              </UButton>
              <p class="text-center text-sm text-[var(--p-text-muted)]">
                Don't have an account?
                <button type="button" class="text-flamingo-600 hover:underline font-medium" @click="mode = 'signup'">
                  Sign up
                </button>
              </p>
            </form>

            <!-- Sign up form -->
            <form v-else class="space-y-4" @submit.prevent="onSignUp">
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="First name">
                  <UInput v-model="signUpFirst" placeholder="John" required />
                </UFormField>
                <UFormField label="Last name">
                  <UInput v-model="signUpLast" placeholder="Doe" required />
                </UFormField>
              </div>
              <UFormField label="Email">
                <UInput v-model="signUpEmail" type="email" placeholder="you@example.com" required />
              </UFormField>
              <UFormField label="Password">
                <UInput v-model="signUpPassword" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" required />
              </UFormField>
              <UFormField label="Confirm password">
                <UInput v-model="signUpPasswordConfirm" type="password" placeholder="••••••••" required />
              </UFormField>
              <UButton type="submit" color="primary" block :loading="loading">
                Create account and submit
              </UButton>
              <p class="text-center text-sm text-[var(--p-text-muted)]">
                Already have an account?
                <button type="button" class="text-flamingo-600 hover:underline font-medium" @click="mode = 'signin'">
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { getActiveDraft, tweakAndAdd, requestQuote } from '~/services/quoteDraft'
import { useAuthStore } from '~/stores/auth'
import { useGuestQuoteStore } from '~/stores/guestQuote'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { parseApiError } from '~/utils/api-error'
import { safeLogError } from '~/utils/safeLog'

const props = withDefaults(
  defineProps<{
    shopSlug?: string
  }>(),
  { shopSlug: '' }
)

const emit = defineEmits<{
  (e: 'submitted', quoteId: number): void
}>()

const isOpen = defineModel<boolean>('open', { default: false })

const authStore = useAuthStore()
const guestStore = useGuestQuoteStore()
const quoteDraftStore = useQuoteDraftStore()
const toast = useToast()
const api = useApi()
const { trackQuoteSubmit } = useAnalyticsTracking()

const mode = ref<'signin' | 'signup'>('signup')
const loading = ref(false)
const error = ref('')

const signInEmail = ref('')
const signInPassword = ref('')
const signUpFirst = ref('')
const signUpLast = ref('')
const signUpEmail = ref('')
const signUpPassword = ref('')
const signUpPasswordConfirm = ref('')

function close() {
  if (!loading.value) {
    isOpen.value = false
    error.value = ''
  }
}

async function createQuoteFromGuest(): Promise<number | null> {
  const { shopSlug } = props
  if (!shopSlug) return null
  const payloads = guestStore.getAddPayloads()
  if (!payloads.length) return null

  const draft = await getActiveDraft(shopSlug, undefined, api)
  for (const p of payloads) {
    await tweakAndAdd(draft.id, { ...p, item_type: undefined } as Parameters<typeof tweakAndAdd>[1], api)
  }
  const updated = await requestQuote(draft.id, api)
  guestStore.clear()
  return updated?.id ?? null
}

async function onSignIn() {
  error.value = ''
  if (!signInEmail.value || !signInPassword.value) {
    error.value = 'Please enter email and password.'
    return
  }
  loading.value = true
  try {
    const result = await authStore.login(signInEmail.value, signInPassword.value, true)
    if (!result.success) {
      error.value = (result as { error?: string }).error ?? 'Sign in failed'
      return
    }
    const itemCount = guestStore.quote?.items.length ?? 0
    const quoteId = await createQuoteFromGuest()
    if (quoteId) {
      quoteDraftStore.setShop(null)
      void trackQuoteSubmit({
        source: 'guest_signin_submit',
        quote_id: quoteId,
        shop_slug: props.shopSlug,
        item_count: itemCount,
      })
      emit('submitted', quoteId)
      close()
      toast.add({ title: 'Quote submitted', description: 'The shop will review and get back to you.', color: 'success' })
    } else {
      error.value = 'Could not create quote. Please try again.'
    }
  } catch (err) {
    safeLogError(err, 'guest-submit.signin')
    error.value = parseApiError(err, 'We could not submit your quote right now. Please try again.')
  } finally {
    loading.value = false
  }
}

async function onSignUp() {
  error.value = ''
  if (!signUpFirst.value || !signUpLast.value || !signUpEmail.value || !signUpPassword.value || !signUpPasswordConfirm.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (signUpPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (!/[A-Z]/.test(signUpPassword.value)) {
    error.value = 'Password must contain an uppercase letter.'
    return
  }
  if (!/[0-9]/.test(signUpPassword.value)) {
    error.value = 'Password must contain a number.'
    return
  }
  if (signUpPassword.value !== signUpPasswordConfirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    const signupResult = await authStore.signup({
      first_name: signUpFirst.value,
      last_name: signUpLast.value,
      email: signUpEmail.value,
      password: signUpPassword.value,
      password_confirm: signUpPasswordConfirm.value,
    })
    if (!signupResult.success) {
      error.value = (signupResult as { error?: string }).error ?? 'Signup failed'
      return
    }
    const loginResult = await authStore.login(signUpEmail.value, signUpPassword.value, true)
    if (!loginResult.success) {
      error.value = 'Account created. Please sign in to submit.'
      mode.value = 'signin'
      signInEmail.value = signUpEmail.value
      return
    }
    const itemCount = guestStore.quote?.items.length ?? 0
    const quoteId = await createQuoteFromGuest()
    if (quoteId) {
      quoteDraftStore.setShop(null)
      void trackQuoteSubmit({
        source: 'guest_signup_submit',
        quote_id: quoteId,
        shop_slug: props.shopSlug,
        item_count: itemCount,
      })
      emit('submitted', quoteId)
      close()
      toast.add({ title: 'Quote submitted', description: 'The shop will review and get back to you.', color: 'success' })
    } else {
      error.value = 'Could not create quote. Please try again.'
    }
  } catch (err) {
    safeLogError(err, 'guest-submit.signup')
    error.value = parseApiError(err, 'We could not submit your quote right now. Please try again.')
  } finally {
    loading.value = false
  }
}

watch(isOpen, (open) => {
  if (open) {
    mode.value = 'signup'
    error.value = ''
    signInEmail.value = ''
    signInPassword.value = ''
    signUpFirst.value = ''
    signUpLast.value = ''
    signUpEmail.value = ''
    signUpPassword.value = ''
    signUpPasswordConfirm.value = ''
  }
})
</script>
