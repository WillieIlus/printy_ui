<script setup lang="ts">
import { computed, ref } from 'vue'
import { Camera, Loader2, UploadCloud, BadgeCheck, Check } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'
import { useApi } from '../../../composables/useApi'
import { API } from '../../../shared/api-paths'

type Photo = {
  id: string
  kind: string
  status: string
  caption: string | null
  altCustom: string | null
  position: number
  thumb: string
  card: string
  full: string
}

type Profile = {
  managerId: string
  displayName: string
  bio: string | null
  businessName: string | null
  specialties: string[]
  areas: string[]
  deliveryOptions: string[]
  languages: string[]
  yearsInPrint: number | null
  turnaroundHours: number | null
  turnaroundIsEstimate: boolean
  availability: string
  phone: string | null
  whatsapp: string | null
  verificationStatus: string
  publicOptIn: boolean
  speciality: string
  acceptsNewJobs: boolean
  maxConcurrentJobs: number
  isPublic: boolean
  pendingHeadshotId: string | null
  approvedHeadshotId: string | null
}

type Bundle = {
  profile: Profile
  photos: Photo[]
  progress: { percent: number; missing: string[]; nextAction: string | null }
  publicView: Record<string, unknown>
}

const props = defineProps<{ initial: Bundle }>()
const { api, getMediaUrl } = useApi()
const bundle = ref<Bundle>(JSON.parse(JSON.stringify(props.initial)) as Bundle)
const step = ref(0)
const saving = ref(false)
const uploading = ref(false)
const uploadError = ref<string | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)
const sampleRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

const STEP_NAMES = ['Photo', 'About you', 'What you print', 'Where you deliver', 'Work samples', 'Preview']

const p = computed(() => bundle.value.profile)
const headshot = computed(() =>
  bundle.value.photos.find((x) => x.id === p.value.approvedHeadshotId)
  ?? bundle.value.photos.find((x) => x.kind === 'headshot' && x.status === 'approved'),
)
const pendingHeadshot = computed(() => bundle.value.photos.find((x) => x.id === p.value.pendingHeadshotId && x.status === 'pending'))
const samples = computed(() => bundle.value.photos.filter((x) => x.kind === 'sample' && x.status !== 'rejected'))

async function save(patch: Record<string, unknown>) {
  saving.value = true
  try {
    bundle.value = await api<Bundle>(API.profile.managerProfile, { method: 'PATCH', body: patch })
  } finally {
    saving.value = false
  }
}

async function upload(file: File, kind: 'headshot' | 'sample') {
  uploading.value = true
  uploadError.value = null
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('kind', kind)
    bundle.value = await api<Bundle>(API.profile.managerPhoto, { method: 'POST', body: form })
    if (fileRef.value) fileRef.value.value = ''
    if (sampleRef.value) sampleRef.value.value = ''
  } catch (error: any) {
    uploadError.value = error?.data?.error || error?.message || 'Upload failed â€” try again'
  } finally {
    uploading.value = false
  }
}

function onFile(event: Event, kind: 'headshot' | 'sample') {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) void upload(file, kind)
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) void upload(file, 'sample')
}

function setList(key: 'specialties' | 'areas' | 'deliveryOptions' | 'languages', value: string) {
  void save({ [key]: value.split(',').map((s) => s.trim()).filter(Boolean) })
}

const initials = computed(() => p.value.displayName.split(' ').map((w) => w[0]).slice(0, 2).join(''))
const verified = computed(() => p.value.verificationStatus === 'verified')
const readyLabel = computed(() => p.value.turnaroundHours
  ? `Ready in about ${p.value.turnaroundHours} hours${p.value.turnaroundIsEstimate ? ' (estimate)' : ''}`
  : 'Ready by tomorrow')
const availabilityLabel = computed(() => p.value.availability === 'available' ? 'Available now' : 'Two jobs in the queue')
const meterLabel = computed(() => bundle.value.progress.nextAction
  ? `Profile ${bundle.value.progress.percent}%: ${bundle.value.progress.nextAction}`
  : `Profile ${bundle.value.progress.percent}% â€” looking good`)
</script>

<template>
  <div class="flex flex-col gap-6 pb-24">
    <div class="rounded-2xl border border-line bg-card p-5">
      <div class="flex items-baseline justify-between">
        <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">{{ meterLabel }}</p>
        <p class="font-mono text-[10px] text-ink-3">{{ saving ? 'Savingâ€¦' : 'Saved' }}</p>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-3">
        <div class="stage-fill h-full bg-brand" :style="{ width: `${bundle.progress.percent}%` }" />
      </div>
    </div>

    <div class="flex gap-1.5 overflow-x-auto pb-1">
      <button
        v-for="(name, i) in STEP_NAMES"
        :key="name"
        type="button"
        class="min-h-[40px] shrink-0 cursor-pointer rounded-full border px-4 font-mono text-[10.5px] font-semibold tracking-[0.06em]"
        :class="step === i ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-card text-ink-2'"
        @click="step = i"
      >
        {{ name }}
      </button>
    </div>

    <div v-if="step === 0" class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <img v-if="headshot" :src="getMediaUrl(headshot.card) ?? ''" :alt="`${p.displayName}, print manager`" class="h-20 w-20 rounded-full object-cover ring-1 ring-line">
        <span v-else class="flex h-20 w-20 items-center justify-center rounded-full bg-paper-2 font-mono text-xl font-bold text-ink-3">{{ initials }}</span>
        <div>
          <button type="button" :disabled="uploading" class="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-brand px-5 text-[13.5px] font-bold text-white hover:bg-brand-deep disabled:opacity-60" @click="fileRef?.click()">
            <Loader2 v-if="uploading" class="h-4 w-4 animate-spin" />
            <Camera v-else class="h-4 w-4" />
            Add photo
          </button>
          <p class="mt-1.5 text-[12px] text-ink-3">JPEG, PNG or WebP, up to 5 MB. Camera or gallery on phone, drag and drop here.</p>
        </div>
        <input ref="fileRef" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" class="sr-only" @change="onFile($event, 'headshot')">
      </div>
      <p v-if="pendingHeadshot" class="rounded-xl border border-amber/40 bg-amber-soft px-4 py-2.5 text-[13px] text-amber">
        Pending review â€” your previous photo stays live meanwhile
      </p>
      <p v-if="uploadError" class="rounded-xl border border-red/40 bg-red-soft px-4 py-2.5 text-[13px] text-red">
        {{ uploadError }} â€” retry with a JPEG, PNG or WebP under 5 MB.
      </p>
    </div>

    <div v-else-if="step === 1" class="grid gap-4 sm:grid-cols-2">
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Display name</span>
        <input :value="p.displayName" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="save({ displayName: ($event.target as HTMLInputElement).value })">
      </label>
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Business name (optional)</span>
        <input :value="p.businessName ?? ''" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="save({ businessName: ($event.target as HTMLInputElement).value })">
      </label>
      <label class="block sm:col-span-2">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Short bio (280 characters max)</span>
        <textarea :value="p.bio ?? ''" rows="4" maxlength="280" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="save({ bio: ($event.target as HTMLTextAreaElement).value })" />
      </label>
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Years in print</span>
        <input type="number" :value="p.yearsInPrint ?? ''" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="save({ yearsInPrint: ($event.target as HTMLInputElement).value })">
      </label>
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Typical turnaround (hours)</span>
        <input type="number" :value="p.turnaroundHours ?? ''" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="save({ turnaroundHours: ($event.target as HTMLInputElement).value })">
      </label>
    </div>

    <div v-else-if="step === 2" class="grid gap-4 sm:grid-cols-2">
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Specialties (product types)</span>
        <input :value="p.specialties.join(', ')" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="setList('specialties', ($event.target as HTMLInputElement).value)">
      </label>
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Languages</span>
        <input :value="p.languages.join(', ')" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="setList('languages', ($event.target as HTMLInputElement).value)">
      </label>
    </div>

    <div v-else-if="step === 3" class="grid gap-4 sm:grid-cols-2">
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Areas served</span>
        <input :value="p.areas.join(', ')" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="setList('areas', ($event.target as HTMLInputElement).value)">
      </label>
      <label class="block">
        <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Delivery options</span>
        <input :value="p.deliveryOptions.join(', ')" class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none" @change="setList('deliveryOptions', ($event.target as HTMLInputElement).value)">
      </label>
    </div>

    <div
      v-else-if="step === 4"
      class="rounded-2xl border-2 border-dashed p-6 text-center transition-colors"
      :class="dragOver ? 'border-brand bg-mint/40' : 'border-line-strong bg-card'"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop="onDrop"
    >
      <UploadCloud class="mx-auto h-6 w-6 text-ink-3" />
      <p class="mt-2 text-[13.5px] font-medium">Drag photos here, or</p>
      <button type="button" class="mt-2 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line-strong px-5 text-[13px] font-semibold" @click="sampleRef?.click()">
        Choose from gallery
      </button>
      <input ref="sampleRef" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="onFile($event, 'sample')">
      <p class="mt-2 text-[12px] text-ink-3">{{ samples.length }} of 8 work photos</p>
      <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <img v-for="s in samples" :key="s.id" :src="getMediaUrl(s.thumb) ?? ''" :alt="s.altCustom ?? s.caption ?? `Finished work by ${p.displayName}`" class="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-line">
      </div>
    </div>

    <div v-else-if="step === 5" class="flex flex-col gap-4">
      <div class="rounded-2xl border border-line bg-card p-5">
        <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">Public profile</p>
        <div class="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div class="max-w-[46ch]">
            <p class="text-[14px] font-semibold text-ink">Show me in the public manager list</p>
            <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">
              Buyers can see your first name, photo and one-line speciality. Printy still has to
              verify you, and the public strip appears once at least three managers qualify.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="p.publicOptIn"
            data-test="manager-public-opt-in"
            class="flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors"
            :class="p.publicOptIn ? 'bg-brand' : 'bg-line'"
            @click="save({ publicOptIn: !p.publicOptIn })"
          >
            <span class="h-5 w-5 rounded-full bg-white transition-transform" :class="p.publicOptIn && 'translate-x-5'" />
          </button>
        </div>
        <label class="mt-4 block">
          <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">One-line speciality (public)</span>
          <input
            :value="p.speciality"
            maxlength="120"
            placeholder="Same-day business cards in Nairobi CBD"
            data-test="manager-public-speciality"
            class="mt-1 w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-[13.5px] focus:border-brand focus:outline-none"
            @change="save({ speciality: ($event.target as HTMLInputElement).value })"
          >
        </label>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <div>
            <p class="text-[13px] font-semibold text-ink">Accepting new jobs</p>
            <p class="mt-0.5 text-[11.5px] text-ink-2">Pause recommendations without losing verified status.</p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="p.acceptsNewJobs"
            data-test="manager-accepts-jobs"
            class="flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors"
            :class="p.acceptsNewJobs ? 'bg-brand' : 'bg-line'"
            @click="save({ acceptsNewJobs: !p.acceptsNewJobs })"
          >
            <span class="h-5 w-5 rounded-full bg-white transition-transform" :class="p.acceptsNewJobs && 'translate-x-5'" />
          </button>
        </div>
        <p
          class="mt-3 rounded-xl border px-3 py-2 text-[12px] font-medium"
          :class="p.isPublic ? 'border-green/40 bg-green-soft text-green' : 'border-line bg-paper-2 text-ink-2'"
          data-test="manager-public-status"
        >
          <template v-if="p.isPublic">Your profile is public. Buyers can see it now.</template>
          <template v-else>Not public yet. You still need verification, a photo, a speciality line and the opt-in above.</template>
        </p>
      </div>

      <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">See how clients see you</p>
      <article class="relative flex max-w-md flex-col overflow-hidden rounded-2xl border border-line bg-card p-7 shadow-card">
        <span class="absolute top-0 right-0 rounded-bl-xl bg-brand px-3 py-1.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-white uppercase">Recommended</span>
        <div class="flex items-start gap-4 pr-28">
          <img v-if="headshot" :src="getMediaUrl(headshot.card) ?? ''" :alt="`${p.displayName}, print manager`" class="h-20 w-20 rounded-full object-cover ring-1 ring-line">
          <span v-else class="flex h-20 w-20 items-center justify-center rounded-full bg-paper-2 font-mono text-xl font-bold text-ink-3">{{ initials }}</span>
          <div class="min-w-0">
            <p class="text-[17px] leading-tight font-bold tracking-tight">{{ p.displayName }}</p>
            <div class="mt-1.5 flex flex-wrap items-center gap-2">
              <span v-if="verified" class="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-mint px-2 py-[3px] font-mono text-[9px] font-semibold tracking-[0.08em] text-brand-deep uppercase">
                <BadgeCheck class="h-3 w-3" /> Verified
              </span>
            </div>
            <div class="mt-2 inline-flex items-center gap-1.5 rounded-full border border-green/30 bg-green-soft px-2.5 py-1 font-mono text-[10px] text-green">
              <Check class="h-3 w-3" /> {{ availabilityLabel }}
            </div>
          </div>
        </div>
        <div class="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
          <div>
            <p class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Standard</p>
            <p class="mt-1 text-[13.5px] font-medium text-ink">{{ readyLabel }}</p>
            <p class="mt-0.5 font-mono text-[10px] text-ink-3">Estimated</p>
          </div>
          <div class="text-right">
            <p class="tabular font-mono text-[17px] font-semibold tracking-tight text-ink">KES 4,200</p>
            <p class="tabular font-mono text-[10.5px] text-ink-3">KES 4.20/pc</p>
          </div>
        </div>
        <button type="button" class="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand px-5 text-[13px] font-bold text-white">Lock this manager</button>
      </article>
    </div>
  </div>
</template>

