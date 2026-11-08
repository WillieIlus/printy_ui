<template>
  <DesignWorkspaceSurface>
    <div class="mx-auto w-full max-w-[820px]">
      <NuxtLink
        :to="backRoute"
        class="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase transition-colors hover:text-brand"
      >
        <ArrowLeft :size="12" /> Back to dashboard
      </NuxtLink>

      <DesignSectionLabel index="AC" tone="brand" class="mt-3">
        <SettingsIcon :size="12" class="mr-1 inline" /> Account settings
      </DesignSectionLabel>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Your profile<span class="block text-ink-2">How partners reach you.</span>
      </h1>

      <DesignLoading v-if="store.loading" class="mt-8" label="Loading your profile…" />

      <DesignAlert v-else-if="store.error" tone="error" class="mt-8">
        {{ store.error }}
      </DesignAlert>

      <template v-else>
        <!-- avatar -->
        <section class="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-card p-5 shadow-card">
          <span class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-[22px] font-bold text-white">
            <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
            <template v-else>{{ initials }}</template>
          </span>
          <div class="min-w-0 flex-1">
            <div class="text-[15px] font-bold tracking-tight text-ink">{{ auth.user?.name || 'Your account' }}</div>
            <div class="mt-0.5 text-[12px] text-ink-2">{{ auth.user?.email }}</div>
          </div>
          <label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand">
            <Loader2 v-if="store.uploading" :size="12" class="animate-spin" />
            <Upload v-else :size="12" />
            {{ store.uploading ? 'Uploading…' : 'Change photo' }}
            <input type="file" accept="image/*" class="hidden" @change="onAvatar" />
          </label>
        </section>

        <!-- contact details -->
        <section class="mt-4 rounded-2xl border border-line bg-card p-5 shadow-card">
          <div class="grid gap-3.5 sm:grid-cols-2">
            <label class="block sm:col-span-2">
              <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">About</span>
              <textarea
                v-model="form.bio"
                rows="3"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
                placeholder="A short line about you or your business."
              />
            </label>
            <label class="block">
              <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Phone</span>
              <input
                v-model="form.phone"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
              >
            </label>
            <label class="block">
              <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Postal code</span>
              <input
                v-model="form.postal_code"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
              >
            </label>
            <label class="block sm:col-span-2">
              <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Address</span>
              <input
                v-model="form.address"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
              >
            </label>
            <label class="block">
              <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">City</span>
              <input
                v-model="form.city"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
              >
            </label>
            <label class="block">
              <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">State / county</span>
              <input
                v-model="form.state"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
              >
            </label>
            <label class="block">
              <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Country</span>
              <input
                v-model="form.country"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
              >
            </label>
          </div>

          <div class="mt-5 flex flex-wrap items-center gap-3">
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-deep disabled:opacity-60"
              :disabled="store.saving"
              @click="save"
            >
              <Loader2 v-if="store.saving" :size="13" class="animate-spin" />
              <Save v-else :size="13" />
              {{ store.saving ? 'Saving…' : 'Save changes' }}
            </button>
            <NuxtLink to="/auth/change-password" class="font-mono text-[10px] font-semibold tracking-[0.14em] text-brand uppercase underline underline-offset-4">
              Change password
            </NuxtLink>
          </div>

          <div v-if="saved" class="mt-4 flex items-center gap-1.5 text-[12.5px] text-green" role="status">
            <Check :size="13" /> Saved
          </div>
          <DesignAlert v-if="saveError" tone="error" class="mt-4">
            {{ saveError }}
          </DesignAlert>
        </section>
      </template>
    </div>
  </DesignWorkspaceSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, Check, Loader2, Save, Settings as SettingsIcon, Upload } from 'lucide-vue-next'
import DesignWorkspaceSurface from '~/components/design/workspace/WorkspaceSurface.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
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
  if (!name) return 'A'
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
