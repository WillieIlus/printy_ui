<template>
  <DesignManagerSurface>
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-3">
        <NuxtLink
          to="/app/manager"
          class="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          <ArrowLeft :size="12" /> Back to dashboard
        </NuxtLink>
        <DesignManagerPageHeader
          index="MC"
          kicker="Clients & shops"
          title="The network around the queue."
          description="Clients you've quoted from this workspace, plus the production shops eligible to take on jobs."
        />
      </div>

      <div class="flex w-fit gap-1 rounded-full border border-line bg-paper-2 p-1">
        <button
          v-for="[k, label] in tabs"
          :key="k"
          class="rounded-full px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors"
          :class="tab === k ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink'"
          @click="switchTab(k)"
        >
          {{ label }}
        </button>
      </div>

      <div v-if="tab === 'clients'" class="flex flex-col gap-5">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3">
            <Search :size="13" class="text-ink-3" />
            <input
              v-model="search"
              type="text"
              placeholder="Search clients by name, phone or email…"
              class="w-full bg-transparent py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-3"
            >
          </div>
          <button
            class="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-50"
            :disabled="searching"
            @click="doSearch"
          >
            <Loader2 v-if="searching" :size="11" class="animate-spin" /> <Search v-else :size="11" /> Search
          </button>
        </div>

        <DesignCard v-if="showClientForm" class="p-5">
          <DesignSectionLabel index="+" tone="brand">New offline client</DesignSectionLabel>
          <p class="mt-3 text-[12.5px] leading-relaxed text-ink-2">
            A phone number is enough — the client needs no email. You'll get a claim link to relay; they choose their own password, so you never take over their account.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <input v-model="form.name" type="text" placeholder="Full name" class="rounded-xl border border-line bg-paper-2 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-brand">
            <input v-model="form.phone" type="text" placeholder="Phone (e.g. 07XX XXX XXX)" class="rounded-xl border border-line bg-paper-2 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-brand">
            <input v-model="form.email" type="text" placeholder="Email (optional)" class="rounded-xl border border-line bg-paper-2 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-brand">
            <input v-model="form.company" type="text" placeholder="Company (optional)" class="rounded-xl border border-line bg-paper-2 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-brand">
          </div>
          <p v-if="clientError" class="mt-3 text-[12.5px] text-red">{{ clientError }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-50"
              :disabled="m.saving"
              @click="createClient"
            >
              <Loader2 v-if="m.saving" :size="11" class="animate-spin" /> <UserPlus v-else :size="11" /> Save client
            </button>
            <button
              class="rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition-colors hover:text-ink"
              @click="closeClientForm"
            >
              Cancel
            </button>
          </div>
        </DesignCard>

        <DesignCard v-if="lastInvite" class="border-green/35 bg-green-soft p-5">
          <div class="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-green uppercase">
            <Link2 :size="12" /> Claim link ready
          </div>
          <p class="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
            Send this to <span class="font-semibold text-ink">{{ lastInvite.name || lastInvite.phone }}</span> on WhatsApp or SMS. They set their own password — you never see it.
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <input :value="lastInvite.claim_url" readonly class="min-w-[220px] flex-1 rounded-xl border border-line bg-card px-3 py-2.5 text-[12px] text-ink">
            <button
              class="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-deep"
              @click="copyInvite(String(lastInvite.claim_url))"
            >
              <Check v-if="copied === lastInvite.claim_url" :size="11" /> <Copy v-else :size="11" />
              {{ copied === lastInvite.claim_url ? 'Copied' : 'Copy link' }}
            </button>
            <button
              class="rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition-colors hover:text-ink"
              @click="lastInvite = null"
            >
              Dismiss
            </button>
          </div>
        </DesignCard>

        <button
          v-else
          class="inline-flex w-fit items-center gap-1.5 rounded-xl border border-brand px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.12em] text-brand uppercase transition-colors hover:bg-mint"
          @click="showClientForm = true"
        >
          <UserPlus :size="11" /> Add offline client
        </button>

        <DesignLoading
          v-if="m.loading && !hasClients"
          variant="inline"
          label="Loading clients…"
          class="py-10"
        />
        <DesignEmptyNote
          v-else-if="!hasClients"
          icon="Users"
          title="No clients visible yet"
          hint="Quotes you prepare create client rows here."
        />
        <div v-else class="flex flex-col gap-2">
          <DesignCard
            v-for="c in m.clients"
            :key="`${c.client_id ?? c.email ?? c.phone}-${c.name}`"
            class="flex flex-wrap items-center gap-3 p-4"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint text-[12px] font-bold text-brand-deep">
              {{ initials(c.name) }}
            </span>
            <div class="min-w-[160px] flex-1">
              <div class="text-[13.5px] font-semibold text-ink">
                {{ c.name || (c.is_offline ? 'Offline client' : 'Client') }}
                <span v-if="c.status === 'invite_pending'" class="ml-1.5 rounded-full bg-amber-soft px-1.5 py-[1px] font-mono text-[8px] tracking-[0.08em] text-amber uppercase">invite pending</span>
                <span v-else-if="c.is_offline" class="ml-1.5 rounded-full bg-paper-2 px-1.5 py-[1px] font-mono text-[8px] tracking-[0.08em] text-ink-2 uppercase">offline</span>
              </div>
              <div class="mt-0.5 text-[11.5px] text-ink-2">
                {{ [c.phone, c.email].filter(Boolean).join(' · ') || `Client #${c.client_id ?? '—'}` }}
              </div>
            </div>
            <div v-if="c.company" class="text-[11.5px] text-ink-2">{{ c.company }}</div>
            <button
              v-if="c.claim_url && c.status === 'invite_pending'"
              class="inline-flex items-center gap-1.5 rounded-xl border border-brand px-3 py-2 font-mono text-[9px] font-bold tracking-[0.12em] text-brand uppercase transition-colors hover:bg-mint"
              @click="copyInvite(String(c.claim_url))"
            >
              <Check v-if="copied === c.claim_url" :size="10" /> <Copy v-else :size="10" />
              {{ copied === c.claim_url ? 'Copied' : 'Invite link' }}
            </button>
          </DesignCard>
        </div>
      </div>

      <div v-else class="flex flex-col gap-5">
        <DesignLoading
          v-if="m.loading && !hasShops"
          variant="inline"
          label="Loading production shops…"
          class="py-10"
        />
        <DesignEmptyNote
          v-else-if="!hasShops"
          icon="Store"
          title="No confirmed printers yet. Printers appear here once they finish setup."
          hint="A shop is listed only after it is confirmed and has active papers, machines and printing rates."
        />
        <div v-else class="grid gap-2.5 sm:grid-cols-2">
          <DesignCard v-for="s in m.productionShops" :key="s.id" class="p-4">
            <div class="flex items-center gap-2.5">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
                <Store :size="16" class="text-brand" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="truncate text-[13.5px] font-semibold text-ink">{{ s.name }}</div>
                <div class="mt-0.5 truncate text-[11px] text-ink-2">{{ s.location || s.city || '—' }}</div>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span v-if="s.supports_custom_requests" class="rounded-full bg-green-soft px-2 py-[2px] font-mono text-[8.5px] tracking-[0.1em] text-green uppercase">custom</span>
              <span v-if="s.supports_catalog_requests" class="rounded-full bg-green-soft px-2 py-[2px] font-mono text-[8.5px] tracking-[0.1em] text-green uppercase">catalog</span>
              <span class="rounded-full bg-paper-2 px-2 py-[2px] font-mono text-[8.5px] tracking-[0.1em] text-ink-2 uppercase">{{ s.pricing_source || 'rate card' }}</span>
            </div>
          </DesignCard>
        </div>
      </div>
    </div>
  </DesignManagerSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ArrowLeft, Check, Copy, Link2, Loader2, Search, Store, UserPlus } from 'lucide-vue-next'
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerPageHeader from '~/components/design/manager/ManagerPageHeader.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import { useManagerStore } from '~/stores/manager'
import type { PartnerClientRow } from '~/shared/types'

const m = useManagerStore()

const tab = ref<'clients' | 'shops'>('clients')
const search = ref('')
const searching = ref(false)
const showClientForm = ref(false)
const clientError = ref('')
const lastInvite = ref<PartnerClientRow | null>(null)
const copied = ref('')
const form = reactive({ name: '', phone: '', email: '', company: '' })

const hasClients = computed(() => m.clients.length > 0)
const hasShops = computed(() => m.productionShops.length > 0)

const tabs: Array<['clients' | 'shops', string]> = [
  ['clients', `Clients${m.clients.length ? ` · ${m.clients.length}` : ''}`],
  ['shops', `Production shops${m.productionShops.length ? ` · ${m.productionShops.length}` : ''}`],
]

function switchTab(next: 'clients' | 'shops') {
  tab.value = next
  if (next === 'clients' && !m.clients.length) m.fetchClients()
  if (next === 'shops' && !m.productionShops.length) m.fetchProductionShops()
}

function initials(name: string) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '??'
  return parts.slice(0, 2).map((part) => part[0]).join('')
}

function closeClientForm() {
  showClientForm.value = false
  clientError.value = ''
}

async function copyInvite(url: string) {
  if (!url) return
  try {
    await navigator.clipboard.writeText(url)
    copied.value = url
  } catch {
    clientError.value = 'Copy failed — select the link and copy it manually.'
  }
}

async function doSearch() {
  searching.value = true
  await m.fetchClients(search.value.trim())
  searching.value = false
}

async function createClient() {
  clientError.value = ''
  if (!form.name.trim() && !form.phone.trim() && !form.email.trim()) {
    clientError.value = 'Add at least a name, phone or email for the client.'
    return
  }
  const created = await m.createClient({
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    company: form.company.trim(),
  })
  if (!created) {
    clientError.value = m.error
    return
  }
  showClientForm.value = false
  Object.assign(form, { name: '', phone: '', email: '', company: '' })
  search.value = ''
  lastInvite.value = created.claim_url ? created : null
  m.fetchClients()
}

onMounted(() => {
  m.fetchClients()
  m.fetchProductionShops()
})
</script>
