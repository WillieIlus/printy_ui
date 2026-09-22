<template>
  <div class="mx-auto w-full max-w-[1000px] px-4 pb-28 pt-8 sm:px-6">
    <NuxtLink
      to="/app/manager"
      class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
    >
      <ArrowLeft :size="12" /> Back to the control room
    </NuxtLink>
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Users :size="12" style="color: var(--accent)" /> clients & shops
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
      The network around the queue.
    </h1>
    <p class="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
      Clients you've quoted from this workspace, plus the production shops eligible to take on jobs.
    </p>

    <div class="mx-auto mt-6 flex w-fit gap-1 rounded-full border p-1" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <button
        v-for="[k, label] in tabs"
        :key="k"
        class="relative rounded-full px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
        :style="{ color: tab === k ? '#fff' : 'var(--sub)' }"
        @click="switchTab(k)"
      >
        <span v-if="tab === k" class="absolute inset-0 rounded-full" :style="{ background: 'var(--accent)' }" />
        <span class="relative">{{ label }}</span>
      </button>
    </div>

    <div v-if="tab === 'clients'" class="mt-6">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border px-3" :style="fieldStyle">
          <Search :size="13" class="text-[var(--sub)]" />
          <input v-model="search" type="text" placeholder="Search clients by name, phone or email…" class="w-full bg-transparent py-2.5 text-[13px] outline-none" :style="{ color: 'var(--ink)' }" />
        </div>
        <button class="press-key inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" @click="doSearch">
          <Loader2 v-if="searching" :size="11" class="animate-spin" /> <Search v-else :size="11" /> Search
        </button>
      </div>

      <div v-if="showClientForm" class="mt-4 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <ML>New offline client</ML>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <input v-model="form.name" type="text" placeholder="Full name" class="rounded-xl border px-3 py-2 text-[13px]" :style="fieldStyle" />
          <input v-model="form.phone" type="text" placeholder="Phone (e.g. 07XX XXX XXX)" class="rounded-xl border px-3 py-2 text-[13px]" :style="fieldStyle" />
          <input v-model="form.email" type="text" placeholder="Email" class="rounded-xl border px-3 py-2 text-[13px]" :style="fieldStyle" />
          <input v-model="form.company" type="text" placeholder="Company (optional)" class="rounded-xl border px-3 py-2 text-[13px]" :style="fieldStyle" />
        </div>
        <p v-if="clientError" class="mt-3 text-[12.5px]" style="color: #FB4D6D">{{ clientError }}</p>
        <div class="mt-3 flex gap-2">
          <button class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="m.saving" @click="createClient">
            <Loader2 v-if="m.saving" :size="11" class="animate-spin" /> <UserPlus v-else :size="11" /> Save client
          </button>
          <button class="press-key rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)' }" @click="showClientForm = false">
            Cancel
          </button>
        </div>
      </div>

      <button v-else class="press-key mt-4 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]" :style="{ borderColor: 'var(--accent)' }" @click="showClientForm = true">
        <UserPlus :size="11" /> Add offline client
      </button>

      <div v-if="m.loading && !hasClients" class="mt-6 flex items-center gap-2 py-10 text-[13px] text-[var(--sub)]">
        <Loader2 :size="15" class="animate-spin" style="color: var(--accent)" /> Loading clients…
      </div>
      <div v-else-if="!hasClients" class="mt-6 rounded-2xl border p-8 text-center text-[13px] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        No clients visible yet. Quotes you prepare create client rows here.
      </div>
      <div v-else class="mt-6 space-y-2">
        <div v-for="c in m.clients" :key="`${c.client_id ?? c.email ?? c.phone}-${c.name}`" class="flex flex-wrap items-center gap-3 rounded-2xl border p-3.5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-disp text-[12px] font-bold" :style="{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)' }">
            {{ initials(c.name) }}
          </span>
          <div class="min-w-[160px] flex-1">
            <div class="text-[13.5px] font-semibold text-[var(--ink)]">
              {{ c.name || (c.is_offline ? 'Offline client' : 'Client') }}
              <span v-if="c.is_offline" class="ml-1.5 rounded-full px-1.5 py-[1px] font-mono2 text-[8px] uppercase tracking-[0.08em] text-[var(--sub)]" :style="{ background: 'var(--panel2)' }">offline</span>
            </div>
            <div class="mt-0.5 text-[11.5px] text-[var(--sub)]">
              {{ [c.phone, c.email].filter(Boolean).join(' · ') || `Client #${c.client_id ?? '—'}` }}
            </div>
          </div>
          <div v-if="c.company" class="text-[11.5px] text-[var(--sub)]">{{ c.company }}</div>
        </div>
      </div>
    </div>

    <div v-else class="mt-6">
      <div v-if="m.loading && !hasShops" class="flex items-center gap-2 py-10 text-[13px] text-[var(--sub)]">
        <Loader2 :size="15" class="animate-spin" style="color: var(--accent)" /> Loading production shops…
      </div>
      <div v-else-if="!hasShops" class="rounded-2xl border p-8 text-center text-[13px] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        No production shops are eligible right now — a shop needs active papers, machines and printing rates.
      </div>
      <div v-else class="grid gap-2.5 sm:grid-cols-2">
        <div v-for="s in m.productionShops" :key="s.id" class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex items-center gap-2.5">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" :style="{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)' }">
              <Store :size="16" style="color: var(--accent)" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="truncate text-[13.5px] font-semibold text-[var(--ink)]">{{ s.name }}</div>
              <div class="mt-0.5 truncate text-[11px] text-[var(--sub)]">{{ s.location || s.city || '—' }}</div>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-if="s.supports_custom_requests" class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="{ background: 'rgba(47,191,113,.12)', color: '#2FBF71' }">custom</span>
            <span v-if="s.supports_catalog_requests" class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="{ background: 'rgba(47,191,113,.12)', color: '#2FBF71' }">catalog</span>
            <span class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ s.pricing_source || 'rate card' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ArrowLeft, Loader2, Search, Store, UserPlus, Users } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'

const m = useManagerStore()

const tab = ref<'clients' | 'shops'>('clients')
const search = ref('')
const searching = ref(false)
const showClientForm = ref(false)
const clientError = ref('')
const form = reactive({ name: '', phone: '', email: '', company: '' })

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }

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
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
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
}

onMounted(() => {
  m.fetchClients()
  m.fetchProductionShops()
})
</script>