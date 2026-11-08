<template>
  <div class="mx-auto w-full max-w-[560px] px-5 pb-24 pt-10 sm:px-8">
    <div class="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase">
      <Ticket :size="12" class="text-brand" /> Client invite
    </div>
    <h1 class="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
      Claim your Printy account<span class="block text-ink-2">No email required.</span>
    </h1>
    <p class="mt-3 text-[13.5px] leading-relaxed text-ink-2">
      Your print manager set this up with your phone number. Choose a password to claim your account — the manager never sees it.
    </p>

    <DesignAlert v-if="claimed" tone="success" title="Account ready" class="mt-6">
      <p class="leading-relaxed">
        You are signed in. Your phone number is verified, and any quotes your manager prepared for it are linked to you.
      </p>
      <DesignButtonLink href="/app/buyer" size="md" class="mt-4">
        Open my dashboard <ArrowRight :size="13" />
      </DesignButtonLink>
    </DesignAlert>

    <form v-else class="mt-6" @submit.prevent="submit">
      <DesignAlert v-if="error" tone="error" class="mb-4">
        {{ error }}
      </DesignAlert>
      <DesignAlert v-if="!token" tone="warning" class="mb-4">
        Open the exact invite link your manager sent — it should include a token.
      </DesignAlert>

      <label class="block">
        <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">
          Your name <span class="normal-case opacity-60">(optional)</span>
        </span>
        <input
          v-model="name"
          class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
          autocomplete="name"
          placeholder="Full name"
        >
      </label>

      <label class="mt-3.5 block">
        <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Choose a password</span>
        <input
          v-model="password"
          type="password"
          class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
          autocomplete="new-password"
          placeholder="At least 8 characters"
        >
      </label>

      <label class="mt-3.5 block">
        <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Confirm password</span>
        <input
          v-model="confirmPassword"
          type="password"
          class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
          autocomplete="new-password"
          placeholder="Repeat your password"
        >
      </label>

      <button
        type="submit"
        class="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-deep disabled:opacity-60"
        :disabled="busy || !token || !password || !confirmPassword"
      >
        <Loader2 v-if="busy" :size="13" class="animate-spin" />
        Claim account
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Loader2, Ticket } from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignButtonLink from '~/components/design/ui/ButtonLink.vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const token = computed(() => {
  const value = route.query.token ?? route.query.claim_token
  return typeof value === 'string' ? value.trim() : ''
})
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const busy = ref(false)
const claimed = ref(false)
const error = ref('')

function message(e: any) {
  return e?.data?.detail ?? e?.message ?? e?.statusMessage ?? 'We could not claim this invite.'
}

async function submit() {
  error.value = ''
  if (!token.value) {
    error.value = 'This invite link is missing its token.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Choose a password with at least 8 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Those passwords do not match.'
    return
  }
  busy.value = true
  try {
    await auth.claimClientInvite({ token: token.value, password: password.value, name: name.value.trim() })
    claimed.value = true
  } catch (e: any) {
    error.value = message(e)
  } finally {
    busy.value = false
  }
}
</script>
