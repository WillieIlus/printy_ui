<template>
  <DesignWorkspaceSurface>
    <div class="mx-auto w-full max-w-[560px]">
      <div class="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase">
        <Ticket :size="12" class="text-brand" /> Offline quote
      </div>
      <h1 class="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
        Claim your Printy quote<span class="block text-ink-2">Link it to your account.</span>
      </h1>
      <p class="mt-3 text-[13.5px] leading-relaxed text-ink-2">
        Paste the claim token from your walk-in quote link, then review it and continue to the M-Pesa payment step.
      </p>

      <DesignAlert v-if="store.claimed" tone="success" title="Quote claimed" class="mt-6">
        <p class="leading-relaxed">
          This quote is now linked to your account. Open it to review the amount due and pay.
        </p>
        <DesignButtonLink href="/app/buyer" size="md" class="mt-4">
          Open my quotes <ArrowRight :size="13" />
        </DesignButtonLink>
      </DesignAlert>

      <form v-else class="mt-6" @submit.prevent="submit">
        <DesignAlert v-if="error" tone="error" class="mb-4">
          {{ error }}
        </DesignAlert>

        <label class="block">
          <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Claim token</span>
          <input
            v-model="token"
            class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
            autocomplete="off"
            placeholder="Paste your claim token"
          >
        </label>

        <button
          type="submit"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-deep disabled:opacity-60"
          :disabled="store.claiming || !token.trim()"
        >
          <Loader2 v-if="store.claiming" :size="13" class="animate-spin" />
          Claim quote
        </button>
      </form>
    </div>
  </DesignWorkspaceSurface>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight, Loader2, Ticket } from 'lucide-vue-next'
import DesignWorkspaceSurface from '~/components/design/workspace/WorkspaceSurface.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignButtonLink from '~/components/design/ui/ButtonLink.vue'
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
