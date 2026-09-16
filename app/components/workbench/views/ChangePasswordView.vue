<template>
  <div class="mx-auto w-full max-w-[460px] px-4 pb-24 pt-10 lg:pt-16">
    <NuxtLink :to="backTo" class="mb-6 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] hover:text-[var(--accent)]">
      <ArrowLeft :size="12" /> Back to dashboard
    </NuxtLink>

    <div class="rounded-3xl border p-6 shadow-[0_10px_50px_-24px_rgba(27,23,16,.4)]" style="border-color: var(--line); background: var(--panel)">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-full"
        :style="{ background: done ? 'color-mix(in srgb, #2FBF71 14%, transparent)' : 'color-mix(in srgb, var(--accent) 14%, transparent)' }"
      >
        <BadgeCheck v-if="done" :size="25" style="color: #2FBF71" />
        <KeyRound v-else :size="24" style="color: var(--accent)" />
      </div>

      <ML class="mt-4">Account security</ML>
      <h2 class="mt-1 font-disp text-[22px] font-bold tracking-tight">
        {{ done ? 'Password changed.' : 'Change your password' }}
      </h2>
      <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--sub)]">
        <template v-if="done">
          You're all set — use your new password next time you sign in. Your current session stays active.
        </template>
        <template v-else>
          Confirm your current password, then set a new one. Keep it to something only you know.
        </template>
      </p>

      <form v-if="!done" class="mt-5 space-y-3.5" @submit.prevent="submit">
        <AuthField v-model="current" :icon="Lock" label="Current password" type="password" placeholder="••••••••" autofocus :error="fieldErr.current" />
        <AuthField v-model="password" :icon="Lock" label="New password" type="password" placeholder="8+ characters" :error="fieldErr.password" />
        <AuthField v-model="confirm" :icon="Lock" label="Confirm new password" type="password" placeholder="Same again" :error="fieldErr.confirm" />

        <div v-if="err" class="rounded-xl px-3 py-2.5 text-[12px]" style="background: rgba(251,77,109,.1); color: #B4243F">{{ err }}</div>

        <button
          type="submit"
          :disabled="busy || !current || !password || !confirm"
          class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          style="background: var(--accent)"
        >
          <Loader2 v-if="busy" :size="15" class="animate-spin" />
          <template v-else>Update password <ArrowRight :size="15" /></template>
          <span v-if="busy" class="sr-only">Updating…</span>
        </button>
      </form>

      <div v-else class="mt-5 grid gap-2.5">
        <NuxtLink
          :to="backTo"
          class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]"
          style="background: var(--accent); color: var(--accentInk)"
        >
          Back to dashboard <ArrowRight :size="15" />
        </NuxtLink>
        <button
          type="button"
          class="press-key rounded-2xl border py-3 font-mono2 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style="border-color: var(--line); color: var(--sub)"
          @click="signOut"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight, BadgeCheck, KeyRound, Loader2, Lock } from 'lucide-vue-next'
import { getApiErrorMessage } from '~/shared/api'

const auth = useAuthStore()
const w = useWorkflowStore()

const current = ref('')
const password = ref('')
const confirm = ref('')
const busy = ref(false)
const done = ref(false)
const err = ref('')
const fieldErr = ref<{ current?: string; password?: string; confirm?: string }>({})

const backTo = computed(() => {
  if (!auth.isAuthenticated) return '/sign-in'
  const home = auth.homeRoute
  return home && home.startsWith('/app') ? home : '/app'
})

async function submit() {
  err.value = ''
  fieldErr.value = {}
  if (!current.value) {
    fieldErr.value.current = 'Enter your current password.'
    return
  }
  if (password.value.length < 8) {
    fieldErr.value.password = 'At least 8 characters.'
    return
  }
  if (password.value !== confirm.value) {
    fieldErr.value.confirm = 'Passwords do not match.'
    return
  }
  busy.value = true
  try {
    await auth.changePassword(current.value, password.value)
    current.value = ''
    password.value = ''
    confirm.value = ''
    done.value = true
  } catch (e: any) {
    err.value = getApiErrorMessage(e, 'Printy could not change your password.')
  } finally {
    busy.value = false
  }
}

async function signOut() {
  w.setRole('buyer')
  await auth.logout()
  w.resetDemo()
}
</script>