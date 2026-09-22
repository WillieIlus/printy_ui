<template>
  <div>
    <!-- ── post-signup states ── -->
    <div v-if="phase === 'verify' || phase === 'welcome'" class="mx-auto w-full max-w-[460px] px-4 pb-24 pt-16">
      <div
        v-if="phase === 'welcome'"
        class="rounded-3xl border p-8 text-center"
        style="border-color: var(--line); background: var(--panel)"
      >
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full" :style="{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }">
          <BadgeCheck :size="26" :style="{ color: accent }" />
        </div>
        <h2 class="mt-4 font-disp text-[24px] font-bold tracking-tight">Welcome, {{ firstName }}.</h2>
        <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--sub)]">Your workspace is ready and prices are now unlocked.</p>
        <button class="press-key mt-5 w-full rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white" :style="{ background: accent }" @click="enter()">
          Enter Printy
        </button>
      </div>

      <div
        v-else
        class="rounded-3xl border p-8 text-center"
        style="border-color: var(--line); background: var(--panel)"
      >
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style="background: color-mix(in srgb, var(--accent) 14%, transparent)">
          <MailCheck :size="26" style="color: var(--accent)" />
        </div>
        <h2 class="mt-4 font-disp text-[24px] font-bold tracking-tight">Check your inbox.</h2>
        <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--sub)]">
          We sent an activation link to <span class="font-semibold text-[var(--ink)]">{{ maskedEmail }}</span>.
          Confirm your email to activate your Printy account, then sign in to start printing.
        </p>

        <div v-if="resendMsg" class="mt-3 rounded-xl px-3 py-2.5 text-[12px]" style="background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent)">{{ resendMsg }}</div>
        <div v-if="resendErr" class="mt-3 rounded-xl px-3 py-2.5 text-[12px]" style="background: rgba(251,77,109,.1); color: #B4243F">{{ resendErr }}</div>

        <div class="mt-5 grid gap-2.5">
          <button class="press-key w-full rounded-2xl py-3 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white" style="background: var(--accent)" :disabled="resending" @click="resend()">
            <Loader2 v-if="resending" :size="15" class="animate-spin" />
            <template v-else>Resend activation email</template>
          </button>
          <NuxtLink to="/sign-in" class="press-key w-full rounded-2xl border py-3 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="border-color: var(--line)">
            Go to sign in
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ── signup form ── -->
    <div v-else class="mx-auto grid w-full max-w-[1080px] gap-10 px-4 pb-24 pt-10 lg:grid-cols-[1fr_420px] lg:pt-16">
      <div class="order-2 lg:order-1">
        <div class="max-w-[44ch]">
          <NuxtLink to="/" class="mb-6 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] hover:text-[var(--accent)]">
            <ArrowLeft :size="12" /> Back to home
          </NuxtLink>
          <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
            <Sparkles :size="11" style="color: var(--accent)" /> free to join · no card
          </div>
          <h1 class="mt-2 font-disp text-[34px] font-bold leading-[1.05] tracking-tight">
            One platform.
            <span class="block text-[var(--sub)]">Three ways in.</span>
          </h1>
          <p class="mt-3 text-[14px] leading-relaxed text-[var(--sub)]">
            Buyers, print managers and print shops all work on the same job — each sees only what matters to them.
          </p>

          <div class="mt-7 space-y-2.5">
            <button
              v-for="m in MODES"
              :key="m.id"
              class="press-key flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors"
              :style="{
                borderColor: m.id === mode ? modeAccent(m.id) : 'var(--line)',
                background: m.id === mode ? `color-mix(in srgb, ${modeAccent(m.id)} 8%, transparent)` : 'var(--panel)',
              }"
              @click="pickMode(m.id)"
            >
              <span
                class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                :style="{
                  background: m.id === mode ? modeAccent(m.id) : 'transparent',
                  boxShadow: m.id === mode ? 'none' : 'inset 0 0 0 1.5px var(--line)',
                }"
              >
                <Check v-if="m.id === mode" :size="11" class="text-white" />
              </span>
              <div class="min-w-0">
                <div class="font-disp text-[14px] font-bold" :style="{ color: m.id === mode ? modeAccent(m.id) : 'var(--ink)' }">{{ m.label }}</div>
                <div class="mt-0.5 text-[12px] leading-snug text-[var(--sub)]">{{ m.blurb }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="order-1 lg:order-2">
        <form class="overflow-hidden rounded-3xl border shadow-[0_10px_50px_-24px_rgba(27,23,16,.4)]" style="border-color: var(--line); background: var(--panel)" @submit.prevent="submit">
          <!-- mode banner -->
          <div class="px-6 pt-6">
            <div class="flex items-center justify-between">
              <ML>Step {{ step }} of 2 · {{ meta.tagline }}</ML>
              <div class="flex gap-1">
                <span v-for="s in 2" :key="s" class="h-1 w-6 rounded-full transition-colors" :style="{ background: s <= step ? accent : 'var(--line)' }" />
              </div>
            </div>
          </div>

          <div v-if="step === 1" class="p-6">
            <h2 class="font-disp text-[22px] font-bold tracking-tight">How will you use Printy?</h2>
            <p class="mt-1.5 text-[13px] leading-relaxed text-[var(--sub)]">Pick the mode that fits. You can be invited into others later.</p>
            <div class="mt-5 space-y-2.5">
              <button
                v-for="m in MODES"
                :key="m.id"
                class="press-key group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5"
                style="border-color: var(--line)"
                @click="pickMode(m.id)"
              >
                <div class="min-w-0 flex-1">
                  <div class="font-disp text-[15px] font-bold" :style="{ color: modeAccent(m.id) }">{{ m.label }}</div>
                  <div class="mt-1 flex flex-wrap gap-1.5">
                    <span v-for="b in m.bullets" :key="b" class="rounded-full px-2 py-[3px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" style="background: var(--panel2); color: var(--sub)">{{ b }}</span>
                  </div>
                </div>
                <ArrowRight :size="16" class="shrink-0 text-[var(--sub)] transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div v-else class="p-6">
            <button type="button" class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)] hover:text-[var(--accent)]" @click="step = 1">
              <ArrowLeft :size="11" /> Change mode
            </button>
            <h2 class="font-disp text-[22px] font-bold tracking-tight" :style="{ color: accent }">{{ meta.cta }}</h2>
            <p class="mt-1 text-[12.5px] text-[var(--sub)]">{{ meta.blurb }}</p>

            <div class="mt-5 space-y-3.5">
              <AuthField v-model="f.name" :icon="User2" label="Full name" placeholder="Ava Lindqvist" :error="fieldErr.name" />
              <AuthField v-model="f.org" :icon="Building2" :label="meta.orgLabel" :placeholder="meta.orgPlaceholder" :error="fieldErr.org" />
              <div class="grid gap-3.5 sm:grid-cols-2">
                <AuthField v-model="f.email" :icon="Mail" label="Email" placeholder="you@company.co.ke" :error="fieldErr.email" />
                <AuthField v-model="f.phone" :icon="Phone" label="Phone (M-Pesa)" placeholder="+254 7…" />
              </div>
              <div class="grid gap-3.5 sm:grid-cols-2">
                <AuthField v-model="f.city" :icon="MapPin" :label="mode === 'printer' ? 'Shop location' : 'City'" placeholder="Nairobi" />
                <AuthField v-model="f.password" :icon="Lock" label="Password" type="password" placeholder="8+ characters" :error="fieldErr.password" />
              </div>

              <div v-if="mode === 'printer'">
                <ML>What can your shop run?</ML>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <button
                    v-for="c in PRINTER_CAPS"
                    :key="c"
                    type="button"
                    class="press-key rounded-full px-3 py-1.5 font-mono2 text-[10px] uppercase tracking-[0.1em] transition-colors"
                    :style="{ background: f.caps.includes(c) ? accent : 'var(--panel2)', color: f.caps.includes(c) ? '#fff' : 'var(--sub)' }"
                    @click="toggleCap(c)"
                  >
                    {{ c }}
                  </button>
                </div>
                <div v-if="fieldErr.caps" class="mt-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[#C81E44]">{{ fieldErr.caps }}</div>
              </div>
            </div>

            <div v-if="err" class="mt-3 rounded-xl px-3 py-2.5 text-[12px]" style="background: rgba(251,77,109,.1); color: #B4243F">{{ err }}</div>

            <button
              type="submit"
              :disabled="busy"
              class="press-key mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
              :style="{ background: accent }"
            >
              <Loader2 v-if="busy" :size="15" class="animate-spin" />
              <template v-else>{{ meta.cta }} <ArrowRight :size="15" /></template>
            </button>

            <div class="mt-3 flex items-start gap-2">
              <ShieldCheck :size="13" class="mt-0.5 shrink-0" :style="{ color: accent }" />
              <p class="text-[11px] leading-relaxed text-[var(--sub)]">
                Free to join. {{ mode === 'buyer' ? 'You only pay when you approve a quote — funds sit in custody until delivery.' : mode === 'printer' ? 'Payout is released the moment the buyer confirms delivery.' : 'Your markup is capped and transparent on every job.' }}
              </p>
            </div>

            <div class="mt-4 text-center text-[12.5px] text-[var(--sub)]">
              Already have an account?{' '}
              <NuxtLink to="/sign-in" class="font-semibold text-[var(--accent)] underline underline-offset-4">Sign in</NuxtLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft, ArrowRight, BadgeCheck, Building2, Check, Loader2, Lock, Mail,
  MailCheck, MapPin, Phone, ShieldCheck, Sparkles, User2,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import type { Role } from '~/shared/workflow/printy'
import { ROLE_META } from '~/shared/workflow/printy'
import { MODES, PRINTER_CAPS, type SignupMode } from '~/shared/workbench/modes'

const ROLE_BY_MODE: Record<SignupMode, 'client' | 'partner' | 'production'> = {
  buyer: 'client',
  manager: 'partner',
  printer: 'production',
}

const auth = useAuthStore()
const calc = useCalculatorStore()

const queryMode = () => {
  const raw = useRoute().query.mode
  return typeof raw === 'string' && (raw === 'buyer' || raw === 'manager' || raw === 'printer')
    ? raw as SignupMode
    : null
}

const mode = ref<SignupMode>(queryMode() ?? 'buyer')
const step = ref<1 | 2>(queryMode() ? 2 : 1)
const f = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  org: '',
  city: '',
  caps: ['Digital'] as string[],
})
const fieldErr = ref<Record<string, string>>({})
const err = ref('')
const busy = ref(false)

const phase = ref<'form' | 'verify' | 'welcome'>('form')
const createdEmail = ref('')
const verificationRequired = ref(false)
const resending = ref(false)
const resendMsg = ref('')
const resendErr = ref('')

const meta = computed(() => MODES.find((m) => m.id === mode.value)!)
const accent = computed(() => ROLE_META[mode.value as Role].theme.accent)
const firstName = computed(() => f.name.trim().split(' ')[0] || 'there')
const maskedEmail = computed(() => {
  const email = createdEmail.value
  const local: string = email.split('@')[0] || email
  const domain: string = email.split('@')[1] || ''
  const maskedLocal = local.length <= 2 ? local.charAt(0) + '***' : local.charAt(0) + '***' + local.charAt(local.length - 1)
  return `${maskedLocal}@${domain}`
})

function modeAccent(id: SignupMode) {
  return ROLE_META[id as Role].theme.accent
}

function pickMode(id: SignupMode) {
  mode.value = id
  step.value = 2
  fieldErr.value = {}
}

function toggleCap(cap: string) {
  f.caps = f.caps.includes(cap) ? f.caps.filter((x) => x !== cap) : [...f.caps, cap]
}

function validate() {
  const e: Record<string, string> = {}
  if (f.name.trim().length < 2) e.name = 'Tell us your name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email'
  if (f.password.length < 8) e.password = 'At least 8 characters'
  if (!f.org.trim()) e.org = `${meta.value.orgLabel} is required`
  if (mode.value === 'printer' && f.caps.length === 0) e.caps = 'Pick at least one capability'
  fieldErr.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  err.value = ''
  if (!validate()) return
  busy.value = true
  try {
    const response = await auth.signUp({
      email: f.email,
      password: f.password,
      name: f.name,
      role: ROLE_BY_MODE[mode.value],
      session_key: calc.guestSessionKey(),
      guest_draft_id: calc.pendingDraft()?.id ?? null,
    })
    calc.forgetPendingDraft()
    createdEmail.value = f.email
    verificationRequired.value = Boolean((response as { verification_required?: boolean })?.verification_required)
    phase.value = verificationRequired.value ? 'verify' : 'welcome'
  } catch (e: any) {
    err.value = e.message ?? 'Could not create your account.'
  } finally {
    busy.value = false
  }
}

async function resend() {
  resending.value = true
  resendMsg.value = ''
  resendErr.value = ''
  try {
    const r = await auth.resendConfirmation(createdEmail.value)
    resendMsg.value = (r as { detail?: string })?.detail ?? 'Activation email sent.'
  } catch (e: any) {
    resendErr.value = e.message ?? 'Could not resend the activation email.'
  } finally {
    resending.value = false
  }
}

function enter() {
  return navigateTo('/app')
}
</script>