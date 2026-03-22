<template>
  <div class="space-y-6">
    <UAlert
      v-if="feedback.errorMessage"
      color="error"
      icon="i-lucide-alert-circle"
      title="Could not create workspace"
      :description="feedback.errorMessage"
      class="rounded-lg"
    />
    <UAlert
      v-if="feedback.successMessage"
      color="success"
      icon="i-lucide-check-circle"
      title="Workspace step completed"
      :description="feedback.successMessage"
      class="rounded-lg"
    />
    <UAlert
      v-if="authStore.error"
      color="error"
      icon="i-lucide-alert-circle"
      :title="authStore.error"
      class="rounded-lg"
      close
      @update:open="(open) => { if (!open) authStore.error = null }"
    />

    <!-- Step 1: Print shop name -->
    <template v-if="step === 1">
      <div>
        <label class="block text-sm font-medium text-[var(--p-text)] mb-1.5">Print shop name</label>
        <input
          v-model="shopName"
          type="text"
          placeholder="e.g. Kaskazini Solutions"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] focus:border-flamingo-500 focus:ring-1 focus:ring-flamingo-500 transition-colors"
          @input="onShopNameInput"
        >
        <p v-if="shopNameError" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ shopNameError }}</p>
      </div>

      <div v-if="slugPreview" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3">
        <p class="text-xs font-medium text-[var(--p-text-muted)] mb-1">Your public URL</p>
        <p class="text-sm font-mono text-[var(--p-text)]">
          {{ siteUrl }}/shops/{{ slugPreview }}
        </p>
        <div class="mt-2 flex items-center gap-2">
          <span
            v-if="slugPreview && !slugChecking"
            class="inline-flex items-center gap-1.5 text-xs font-medium"
            :class="slugAvailable ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'"
          >
            <UIcon :name="slugAvailable ? 'i-lucide-check-circle' : 'i-lucide-alert-circle'" class="w-3.5 h-3.5" />
            {{ slugAvailable ? 'Available' : 'Already taken' }}
          </span>
          <span v-else-if="slugChecking" class="inline-flex items-center gap-1.5 text-xs text-[var(--p-text-muted)]">
            <UIcon name="i-lucide-loader-2" class="w-3.5 h-3.5 animate-spin" />
            Checking...
          </span>
        </div>
      </div>

      <DashboardLoadingButton
        type="button"
        color="primary"
        block
        class="rounded-xl"
        :disabled="!canContinueStep1"
        @click="step = 2"
      >
        Continue
      </DashboardLoadingButton>
    </template>

    <!-- Step 2: Your details -->
    <template v-else>
      <div class="flex items-center gap-2 mb-4">
        <button
          type="button"
          class="text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] flex items-center gap-1"
          @click="step = 1"
        >
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back
        </button>
      </div>

      <div class="rounded-xl border border-flamingo-200 dark:border-flamingo-800 bg-flamingo-50 dark:bg-flamingo-950/30 px-4 py-3 mb-4">
        <p class="text-sm font-medium text-flamingo-800 dark:text-flamingo-200">{{ shopName }}</p>
        <p class="text-xs text-flamingo-600 dark:text-flamingo-400 mt-0.5">printy.ke/shops/{{ slugPreview }}</p>
      </div>

      <VeeForm v-slot="{ meta }" :validation-schema="step2Schema" @submit="onSubmit">
        <div class="space-y-4">
          <FormsFormInput name="name" label="Your name" placeholder="John Kamau" icon="i-lucide-user" required />
          <FormsFormInput name="email" label="Email" type="email" placeholder="john@example.com" icon="i-lucide-mail" required />
          <FormsFormInput name="password" label="Password" type="password" placeholder="Create a password" icon="i-lucide-lock" required />
          <FormsFormInput name="password_confirm" label="Confirm password" type="password" placeholder="Confirm your password" icon="i-lucide-lock" required />
          <label
            class="flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer select-none"
            :class="agreeTerms
              ? 'border-flamingo-500 bg-flamingo-50 dark:bg-flamingo-950/30 dark:border-flamingo-500'
              : 'border-[var(--p-border)] bg-[var(--p-surface)] hover:border-[var(--p-border)]'"
          >
            <UCheckbox v-model="agreeTerms" color="primary" class="mt-0.5 shrink-0 size-5" />
            <span class="text-sm text-[var(--p-text-muted)]">
              I agree to the <NuxtLink to="/terms" class="text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium">Terms of Service</NuxtLink>
              and <NuxtLink to="/privacy" class="text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium">Privacy Policy</NuxtLink>
            </span>
          </label>
          <DashboardLoadingButton
            type="submit"
            color="primary"
            block
            class="rounded-xl"
            :loading="loading"
            :disabled="!meta.valid || !agreeTerms"
          >
            Create workspace
          </DashboardLoadingButton>
        </div>
      </VeeForm>
    </template>
  </div>
</template>

<script setup lang="ts">
import { object, string, ref as yupRef } from 'yup'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { slugify } from '~/utils/slugify'

const authStore = useAuthStore()
const shopStore = useShopStore()
const feedback = useSubmissionFeedback()
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://printy.ke'

const step = defineModel<number>('step', { default: 1 })
const shopName = ref('')
const slugPreview = ref('')
const slugAvailable = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)

const { checkAvailability, checking: slugChecking } = useSlugAvailability()

const shopNameError = computed(() => {
  const name = shopName.value.trim()
  if (!name) return ''
  if (name.length < 2) return 'Shop name must be at least 2 characters'
  return ''
})

const canContinueStep1 = computed(() => {
  const name = shopName.value.trim()
  return name.length >= 2 && slugPreview.value && slugAvailable.value && !slugChecking.value
})

const step2Schema = object({
  name: string().required('Your name is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  password_confirm: string()
    .oneOf([yupRef('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

let slugCheckTimeout: ReturnType<typeof setTimeout> | null = null

function onShopNameInput() {
  const name = shopName.value.trim()
  slugPreview.value = slugify(name)
  slugAvailable.value = false

  if (slugCheckTimeout) clearTimeout(slugCheckTimeout)
  if (!slugPreview.value) return

  slugCheckTimeout = setTimeout(async () => {
    slugAvailable.value = await checkAvailability(slugPreview.value)
  }, 400)
}

async function onSubmit(values: Record<string, unknown>) {
  const name = (values.name as string)?.trim() || ''
  const email = (values.email as string)?.trim() || ''
  const password = values.password as string

  loading.value = true
  authStore.error = null
  feedback.reset()
  try {
    const signupResult = await authStore.signup({
      email,
      password,
      password_confirm: password,
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ').slice(1).join(' ') || '',
    })

    if (!signupResult.success) {
      feedback.setError(signupResult.error ?? 'We could not create your account right now.')
      loading.value = false
      return
    }

    const loginResult = await authStore.login(email, password, true)
    if (loginResult.success) {
      const shopResult = await shopStore.createShop({
        name: shopName.value.trim(),
        description: '',
        business_email: email,
        phone_number: '',
        address_line: '',
        city: 'Nairobi',
        state: 'Nairobi',
        country: 'Kenya',
        zip_code: '',
      })
      if (shopResult.success && shopResult.shop) {
        feedback.setSuccess('Workspace created successfully.')
        await navigateTo(`/dashboard/shops/${shopResult.shop.slug}/setup`)
        return
      }
    }

    sessionStorage.setItem('pending_printy_shop_name', shopName.value.trim())
    feedback.setSuccess('Account created. Verify your email to finish opening the workspace.')
    await navigateTo({ path: '/auth/verify-email', query: { email } })
  } finally {
    loading.value = false
  }
}
</script>
