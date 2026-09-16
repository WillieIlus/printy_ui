<template>
  <div class="mx-auto grid w-full max-w-[1080px] gap-10 px-4 pb-24 pt-10 lg:grid-cols-[1fr_420px] lg:pt-16">
    <div class="order-2 lg:order-1">
      <div class="max-w-[42ch]">
        <NuxtLink to="/" class="mb-6 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] hover:text-[var(--accent)]">
          <ArrowLeft :size="12" /> Back to home
        </NuxtLink>
        <h1 class="font-disp text-[34px] font-bold leading-[1.05] tracking-tight">
          Welcome back.
          <span class="block text-[var(--sub)]">Your jobs kept moving.</span>
        </h1>
        <p class="mt-3 text-[14px] leading-relaxed text-[var(--sub)]">
          Sign in to unlock live pricing, approve artwork, and see exactly who has the ball on every job.
        </p>

        <div class="mt-7 rounded-2xl border p-4" style="border-color: var(--line); background: var(--panel)">
          <ML>Demo accounts · password "{{ DEMO_PASSWORD }}"</ML>
          <div class="mt-3 grid gap-1.5">
            <div
              v-for="d in DEMO_LOGINS"
              :key="d.email"
              class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-[var(--panel2)]"
            >
              <span class="h-2 w-2 shrink-0 rounded-full" :style="{ background: roleAccent(d.role) }" />
              <button
                class="min-w-0 flex-1 text-left"
                @click="useDemo(d)"
              >
                <span class="block font-disp text-[12.5px] font-semibold">{{ d.label }}</span>
                <span class="block truncate font-mono2 text-[9.5px] text-[var(--sub)]">{{ d.email }}</span>
              </button>
              <button
                type="button"
                :disabled="busy || quick !== ''"
                :title="`Open ${d.label} dashboard`"
                class="press-key shrink-0 rounded-lg px-2.5 py-1.5 font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em] transition-colors disabled:opacity-50"
                :style="{ background: roleAccent(d.role), color: '#fff' }"
                @click="quickSignIn(d)"
              >
                <Loader2 v-if="quick === d.email" :size="11" class="animate-spin" />
                <template v-else>Open</template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="order-1 lg:order-2">
      <form class="rounded-3xl border p-6 shadow-[0_10px_50px_-24px_rgba(27,23,16,.4)]" style="border-color: var(--line); background: var(--panel)" @submit.prevent="submit">
        <ML>Sign in</ML>
        <h2 class="mt-1 font-disp text-[22px] font-bold tracking-tight">Your Printy account</h2>

        <div class="mt-5 space-y-3.5">
          <label class="block">
            <ML>Email</ML>
            <div class="mt-1.5 flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors focus-within:border-[var(--accent)]" style="border-color: var(--line); background: var(--panel)">
              <Mail :size="15" style="color: var(--sub)" class="shrink-0" />
              <input v-model="email" type="email" autofocus placeholder="you@company.co.ke" class="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--sub)] placeholder:opacity-60" />
            </div>
          </label>
          <label class="block">
            <ML>Password</ML>
            <div class="mt-1.5 flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors focus-within:border-[var(--accent)]" style="border-color: var(--line); background: var(--panel)">
              <Lock :size="15" style="color: var(--sub)" class="shrink-0" />
              <input v-model="password" :type="showPw ? 'text' : 'password'" placeholder="••••••••" class="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--sub)] placeholder:opacity-60" />
              <button type="button" class="shrink-0" style="color: var(--sub)" @click="showPw = !showPw">
                <EyeOff v-if="showPw" :size="14" />
                <Eye v-else :size="14" />
              </button>
            </div>
          </label>
        </div>

        <div class="mt-2 flex justify-end">
          <NuxtLink to="/auth/forgot-password" class="font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]">
            Forgot password?
          </NuxtLink>
        </div>

        <div v-if="err" class="mt-3 rounded-xl px-3 py-2.5 text-[12px]" style="background: rgba(251,77,109,.1); color: #B4243F">{{ err }}</div>

        <button
          type="submit"
          :disabled="busy || !email || !password"
          class="press-key mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          style="background: var(--accent)"
        >
          <Loader2 v-if="busy" :size="15" class="animate-spin" />
          <template v-else>Sign in <ArrowRight :size="15" /></template>
          <span v-if="busy" class="sr-only">Signing in…</span>
        </button>

        <div class="mt-4 text-center text-[12.5px] text-[var(--sub)]">
          New to Printy?
          <NuxtLink to="/sign-up" class="font-semibold text-[var(--accent)] underline underline-offset-4">Create an account</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import type { Role } from '~/shared/workflow/printy'
import { ROLE_META } from '~/shared/workflow/printy'
import { protoHomeRoute } from '~/shared/workspace'

const DEMO_PASSWORD = 'printy'
const DEMO_LOGINS: Array<{ label: string; email: string; role: Role }> = [
  { label: 'Buyer', email: 'ava@studionorth.co.ke', role: 'buyer' },
  { label: 'Print Manager', email: 'dale@printy.ke', role: 'manager' },
  { label: 'Printer', email: 'jon@northpress.co.ke', role: 'printer' },
  { label: 'Admin', email: 'admin@printy.ke', role: 'admin' },
]

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const showPw = ref(false)
const busy = ref(false)
const quick = ref('')
const err = ref('')

const redirect = computed(() => useRoute().query.redirect)
const next = computed(() => (typeof redirect.value === 'string' && redirect.value.startsWith('/') ? redirect.value : '/app'))

function roleAccent(role: Role) {
  return ROLE_META[role].theme.accent
}

function useDemo(d: { email: string }) {
  email.value = d.email
  password.value = DEMO_PASSWORD
  err.value = ''
}

async function quickSignIn(d: { email: string; role: Role }) {
  err.value = ''
  quick.value = d.email
  try {
    await auth.signIn(d.email, DEMO_PASSWORD)
    await navigateTo(protoHomeRoute(d.role))
  } catch (e: any) {
    err.value = e.message ?? e.statusMessage ?? 'Could not sign in.'
  } finally {
    quick.value = ''
  }
}

async function submit() {
  err.value = ''
  busy.value = true
  try {
    await auth.signIn(email.value, password.value)
    await navigateTo(next.value)
  } catch (e: any) {
    err.value = e.message ?? e.statusMessage ?? 'Could not sign in.'
  } finally {
    busy.value = false
  }
}
</script>