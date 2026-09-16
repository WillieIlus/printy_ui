<template>
  <div class="mx-auto w-full max-w-[460px] px-4 pb-24 pt-10 lg:pt-16">
    <NuxtLink to="/" class="mb-6 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] hover:text-[var(--accent)]">
      <ArrowLeft :size="12" /> Back to home
    </NuxtLink>

    <div class="rounded-3xl border p-6 shadow-[0_10px_50px_-24px_rgba(27,23,16,.4)]" style="border-color: var(--line); background: var(--panel)">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-full"
        :style="{
          background: done ? 'color-mix(in srgb, #2FBF71 14%, transparent)'
            : 'color-mix(in srgb, var(--accent) 14%, transparent)',
        }"
      >
        <BadgeCheck v-if="done" :size="25" style="color: #2FBF71" />
        <CircleAlert v-else-if="missingKey" :size="24" style="color: #FB4D6D" />
        <KeyRound v-else :size="24" style="color: var(--accent)" />
      </div>

      <ML class="mt-4">Reset password</ML>
      <h2 class="mt-1 font-disp text-[22px] font-bold tracking-tight">
        {{ done ? 'Password updated.' : missingKey ? 'Link is missing something.' : 'Choose a new password.' }}
      </h2>
      <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--sub)]">
        <template v-if="done">
          Your password has been reset. Sign in with your new password to get back to your jobs.
        </template>
        <template v-else-if="missingKey">
          This reset link has no key. Request a fresh one and use the link from the email.
        </template>
        <template v-else>
          Make it at least 8 characters — something you haven't used before.
        </template>
      </p>

      <form v-if="!done && !missingKey" class="mt-5 space-y-3.5" @submit.prevent="submit">
        <AuthField v-model="password" :icon="Lock" label="New password" type="password" placeholder="8+ characters" autofocus :error="fieldErr.password" />
        <AuthField v-model="confirm" :icon="Lock" label="Confirm password" type="password" placeholder="Same again" :error="fieldErr.confirm" />

        <div v-if="err" class="rounded-xl px-3 py-2.5 text-[12px]" style="background: rgba(251,77,109,.1); color: #B4243F">{{ err }}</div>

        <button
          type="submit"
          :disabled="busy || !password || !confirm"
          class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          style="background: var(--accent)"
        >
          <Loader2 v-if="busy" :size="15" class="animate-spin" />
          <template v-else>Reset password <ArrowRight :size="15" /></template>
          <span v-if="busy" class="sr-only">Resetting…</span>
        </button>
      </form>

      <div v-if="!done && !missingKey" class="mt-5 text-center text-[12.5px] text-[var(--sub)]">
        Didn't get a link?
        <NuxtLink to="/auth/forgot-password" class="font-semibold text-[var(--accent)] underline underline-offset-4">Request one</NuxtLink>
      </div>

      <div v-if="done || missingKey" class="mt-5">
        <NuxtLink
          :to="missingKey ? '/auth/forgot-password' : '/sign-in'"
          class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]"
          style="background: var(--accent); color: var(--accentInk)"
        >
          {{ missingKey ? 'Request a new link' : 'Go to sign in' }} <ArrowRight :size="15" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight, BadgeCheck, CircleAlert, KeyRound, Loader2, Lock } from 'lucide-vue-next'
import { getApiErrorMessage } from '~/shared/api'

const auth = useAuthStore()
const route = useRoute()

const key = ref('')
const password = ref('')
const confirm = ref('')
const busy = ref(false)
const done = ref(false)
const missingKey = ref(false)
const err = ref('')
const fieldErr = ref<{ password?: string; confirm?: string }>({})

onMounted(() => {
  const param = typeof route.query.key === 'string' ? route.query.key : ''
  key.value = param && param.trim() ? param.trim() : ''
  missingKey.value = !key.value
})

async function submit() {
  err.value = ''
  fieldErr.value = {}
  if (password.value.length < 8) {
    fieldErr.value.password = 'At least 8 characters.'
    return
  }
  if (password.value !== confirm.value) {
    fieldErr.value.confirm = 'Passwords do not match.'
    return
  }
  if (!key.value) {
    missingKey.value = true
    return
  }
  busy.value = true
  try {
    await auth.resetPassword({ key: key.value, password: password.value })
    done.value = true
  } catch (e: any) {
    err.value = getApiErrorMessage(e, 'Printy could not reset your password. The link may have expired — request a new one.')
  } finally {
    busy.value = false
  }
}
</script>