<template>
  <div class="mx-auto w-full max-w-[460px] px-4 pb-24 pt-16">
    <div class="rounded-3xl border p-8 text-center" style="border-color: var(--line); background: var(--panel)">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
        style="background: color-mix(in srgb, var(--accent) 14%, transparent)"
      >
        <Loader2 v-if="status === 'loading'" :size="24" class="animate-spin" style="color: var(--accent)" />
        <MailCheck v-else-if="status === 'success'" :size="26" style="color: var(--accent)" />
        <CircleAlert v-else :size="26" style="color: #FB4D6D" />
      </div>

      <h2 class="mt-4 font-disp text-[24px] font-bold tracking-tight">{{ statusTitle }}</h2>
      <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--sub)]">{{ message }}</p>

      <div v-if="status !== 'loading'" class="mt-5 text-left">
        <label class="block">
          <ML>Email address</ML>
          <div class="mt-1.5 flex items-center gap-2.5 rounded-xl border px-3.5 py-3" style="border-color: var(--line); background: var(--panel2)">
            <Mail :size="15" style="color: var(--sub)" class="shrink-0" />
            <input v-model="email" type="email" placeholder="you@example.com" class="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--sub)] placeholder:opacity-60" />
          </div>
        </label>

        <button
          class="press-key mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          style="background: var(--accent)"
          :disabled="resending || !email.trim()"
          @click="resend()"
        >
          <Loader2 v-if="resending" :size="15" class="animate-spin" />
          <template v-else>Resend verification email</template>
        </button>

        <NuxtLink to="/sign-in" class="mt-4 block text-center text-[13px] font-semibold text-[var(--accent)] underline underline-offset-4">
          Continue to sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert, Loader2, Mail, MailCheck } from 'lucide-vue-next'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: 'default' })

useHead({ title: 'Printy - Confirm Email' })

const auth = useAuthStore()
const route = useRoute()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Checking your verification link...')
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const resending = ref(false)

const statusTitle = computed(() => {
  if (status.value === 'success') return 'Email verified'
  if (status.value === 'error') return 'Verification failed'
  return 'Checking link'
})

onMounted(async () => {
  const key = typeof route.query.key === 'string'
    ? route.query.key
    : typeof route.query.token === 'string'
      ? route.query.token
      : ''
  if (!key) {
    status.value = 'error'
    message.value = 'This verification link is missing its key.'
    return
  }

  try {
    const result = await auth.confirmEmail(key)
    status.value = 'success'
    message.value = result.detail ?? 'Your email is verified. You can now sign in.'
    if (result.email) {
      email.value = result.email
    }
  } catch (error: unknown) {
    status.value = 'error'
    message.value = getApiErrorMessage(error, 'This verification link is invalid or expired.')
  }
})

async function resend() {
  resending.value = true
  try {
    const result = await auth.resendConfirmation(email.value.trim())
    message.value = result.detail ?? 'Activation email sent.'
    status.value = 'success'
  } catch (error: unknown) {
    message.value = getApiErrorMessage(error, 'Printy could not resend the verification email.')
  } finally {
    resending.value = false
  }
}
</script>