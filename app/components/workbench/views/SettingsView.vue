<template>
  <div class="mx-auto w-full max-w-[820px] px-4 pb-28 pt-8 sm:px-6">
    <NuxtLink
      :to="backRoute"
      class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
    >
      <ArrowLeft :size="12" /> Back to dashboard
    </NuxtLink>
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <SettingsIcon :size="12" style="color: var(--accent)" /> Account settings
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
      Your profile<span class="block text-[var(--sub)]">How partners reach you.</span>
    </h1>

    <div v-if="store.loading" class="mt-16 flex flex-col items-center gap-3 text-[var(--sub)]">
      <Loader2 :size="22" class="animate-spin" :style="{ color: 'var(--accent)' }" />
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em]">Loading your profile…</span>
    </div>

    <div v-else-if="store.error" class="mt-10 rounded-2xl border px-5 py-6 text-[13px]" style="border-color: rgba(251,77,109,.4); background: rgba(251,77,109,.08); color: #B4243F">
      {{ store.error }}
    </div>

    <template v-else>
      <!-- avatar -->
      <section class="mt-6 flex items-center gap-4 rounded-3xl border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <span class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full font-disp text-[22px] font-bold" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
          <template v-else>{{ initials }}</template>
        </span>
        <div class="min-w-0 flex-1">
          <div class="font-disp text-[15px] font-bold tracking-tight">{{ auth.user?.name || 'Your account' }}</div>
          <div class="mt-0.5 text-[12px] text-[var(--sub)]">{{ auth.user?.email }}</div>
        </div>
        <label class="press-key inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }">
          <Loader2 v-if="store.uploading" :size="12" class="animate-spin" />
          <Upload v-else :size="12" />
          {{ store.uploading ? 'Uploading…' : 'Change photo' }}
          <input type="file" accept="image/*" class="hidden" @change="onAvatar" />
        </label>
      </section>

      <!-- contact details -->
      <section class="mt-4 rounded-3xl border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <div class="grid gap-3.5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <ML>About</ML>
            <textarea v-model="form.bio" rows="3" class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]" :style="{ borderColor: 'var(--line)' }" placeholder="A short line about you or your business." />
          </div>
          <div>
            <ML>Phone</ML>
            <input v-model="form.phone" class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]" :style="{ borderColor: 'var(--line)' }" />
          </div>
          <div>
            <ML>Postal code</ML>
            <input v-model="form.postal_code" class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]" :style="{ borderColor: 'var(--line)' }" />
          </div>
          <div class="sm:col-span-2">
            <ML>Address</ML>
            <input v-model="form.address" class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]" :style="{ borderColor: 'var(--line)' }" />
          </div>
          <div>
            <ML>City</ML>
            <input v-model="form.city" class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]" :style="{ borderColor: 'var(--line)' }" />
          </div>
          <div>
            <ML>State / county</ML>
            <input v-model="form.state" class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]" :style="{ borderColor: 'var(--line)' }" />
          </div>
          <div>
            <ML>Country</ML>
            <input v-model="form.country" class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]" :style="{ borderColor: 'var(--line)' }" />
          </div>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-3">
          <button
            class="press-key inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] disabled:opacity-60"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
            :disabled="store.saving"
            @click="save"
          >
            <Loader2 v-if="store.saving" :size="13" class="animate-spin" />
            <Save v-else :size="13" />
            {{ store.saving ? 'Saving…' : 'Save changes' }}
          </button>
          <NuxtLink to="/auth/change-password" class="font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]" :style="{ color: 'var(--accent)' }">
            Change password
          </NuxtLink>
          <span v-if="saved" class="inline-flex items-center gap-1.5 text-[12px]" style="color: #1E8E52"><Check :size="13" /> Saved</span>
          <span v-if="saveError" class="text-[12px]" style="color: #B4243F">{{ saveError }}</span>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, Check, Loader2, Save, Settings as SettingsIcon, Upload } from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { getApiErrorMessage } from '~/shared/api'
import type { UserProfilePatch } from '~/shared/types'

const auth = useAuthStore()
const store = useProfileStore()
const { getMediaUrl } = useApi()

const form = ref<UserProfilePatch>({
  bio: '', phone: '', address: '', city: '', state: '', country: '', postal_code: '',
})
const saved = ref(false)
const saveError = ref('')

const backRoute = computed(() => auth.homeRoute || '/app')
const avatarUrl = computed(() => getMediaUrl(store.avatarUrl))
const initials = computed(() => {
  const name = auth.user?.name?.trim()
  if (!name) return '·'
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
})

function syncForm() {
  const profile = store.profile
  if (!profile) return
  form.value = {
    bio: profile.bio ?? '',
    phone: profile.phone ?? '',
    address: profile.address ?? '',
    city: profile.city ?? '',
    state: profile.state ?? '',
    country: profile.country ?? '',
    postal_code: profile.postal_code ?? '',
  }
}

async function save() {
  saveError.value = ''
  saved.value = false
  try {
    await store.update(form.value)
    syncForm()
    saved.value = true
  } catch (e) {
    saveError.value = getApiErrorMessage(e, 'Your profile could not be saved.')
  }
}

async function onAvatar(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  saveError.value = ''
  try {
    await store.uploadAvatar(file)
    if (store.avatarUrl) {
      await auth.updateProfile({ avatar: store.avatarUrl })
    }
  } catch (e) {
    saveError.value = getApiErrorMessage(e, 'Your photo could not be uploaded.')
  } finally {
    input.value = ''
  }
}

onMounted(async () => {
  if (!store.profile) {
    await store.fetch()
  }
  syncForm()
})
</script>
