<template>
  <div class="mx-auto w-full max-w-[560px] px-4 pb-28 pt-10 sm:px-6">
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Ticket :size="12" style="color: var(--accent)" /> Offline quote
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
      Claim your Printy quote<span class="block text-[var(--sub)]">Link it to your account.</span>
    </h1>
    <p class="mt-3 text-[13.5px] leading-relaxed text-[var(--sub)]">
      Paste the claim token from your walk-in quote link, then review it and continue to the M-Pesa payment step.
    </p>

    <div v-if="store.claimed" class="mt-6 rounded-2xl border px-5 py-5" style="border-color: rgba(30,142,82,.35); background: rgba(30,142,82,.08)">
      <div class="flex items-center gap-2 font-disp text-[15px] font-bold" style="color: #1E8E52">
        <CheckCheck :size="16" /> Quote claimed
      </div>
      <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">
        This quote is now linked to your account. Open it to review the amount due and pay.
      </p>
      <NuxtLink
        to="/app/buyer"
        class="press-key mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white"
        style="background: var(--accent)"
      >
        Open my quotes <ArrowRight :size="13" />
      </NuxtLink>
    </div>

    <form v-else class="mt-6" @submit.prevent="submit">
      <div v-if="error" class="mb-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-[12.5px]" style="background: rgba(251,77,109,.08); color: #B4243F">
        <AlertCircle :size="14" class="mt-0.5 shrink-0" />
        <p>{{ error }}</p>
      </div>
      <ML>Claim token</ML>
      <input
        v-model="token"
        class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]"
        :style="{ borderColor: 'var(--line)' }"
        autocomplete="off"
        placeholder="Paste your claim token"
      />
      <button
        type="submit"
        class="press-key mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-60"
        style="background: var(--accent)"
        :disabled="store.claiming || !token.trim()"
      >
        <Loader2 v-if="store.claiming" :size="13" class="animate-spin" />
        Claim quote
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AlertCircle, ArrowRight, CheckCheck, Loader2, Ticket } from 'lucide-vue-next'
import { useOfflineClaimStore } from '~/stores/offline-claim'
import { getApiErrorMessage } from '~/shared/api'

const route = useRoute()
const store = useOfflineClaimStore()
const token = ref(String(route.query.token || route.query.claim_token || '').trim())
const error = ref('')

async function submit() {
  const value = token.value.trim()
  if (!value) {
    error.value = 'Enter the claim token from your quote link.'
    return
  }
  error.value = ''
  try {
    await store.claim(value)
  } catch (e) {
    error.value = getApiErrorMessage(e, 'Printy could not claim this offline quote.')
  }
}

onMounted(() => {
  if (token.value) {
    submit()
  }
})
</script>
