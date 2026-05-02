<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Public shop details"
        description="Buyers use this to decide whether your shop looks trustworthy before sending a request."
      />

      <div class="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div class="rounded-3xl border border-[var(--p-primary)]/15 bg-[var(--p-primary)]/6 px-5 py-5">
          <div class="flex items-start gap-4">
            <div class="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--p-primary)]/12 text-[var(--p-primary)]">
              <Icon name="lucide:shield-check" class="size-5" />
            </div>
            <div class="space-y-2">
              <p class="text-sm font-semibold text-[var(--p-text)]">Trust-building details</p>
              <p class="text-sm leading-6 text-[var(--p-text-muted)]">
                Buyers look here before they send a request. Clear location, service area, turnaround, and public contact details make your shop feel real and reliable.
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-5">
          <p class="text-sm font-semibold text-[var(--p-text)]">Public visibility</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            {{ form.is_public ? 'Your shop can appear on public shop pages and marketplace browsing.' : 'Your shop stays private until you publish it.' }}
          </p>
          <div class="mt-4 flex flex-wrap gap-2 text-xs">
            <span class="rounded-full px-3 py-1 font-semibold" :class="form.is_public ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-700'">
              {{ form.is_public ? 'Published' : 'Private' }}
            </span>
            <span class="rounded-full bg-[var(--p-surface-muted)] px-3 py-1 font-semibold text-[var(--p-text-muted)]">
              {{ currentShop?.can_receive_requests ? 'Can receive requests' : 'Request readiness depends on setup' }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-2xl bg-[var(--p-surface)]" />
      </div>

      <div
        v-else-if="loadError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-5 py-4 text-sm text-[var(--p-error)]"
      >
        <p class="font-semibold">Could not load shop profile.</p>
        <p class="mt-1">{{ loadError }}</p>
        <BaseButton class="mt-3" size="sm" variant="ghost" @click="loadProfile">Retry</BaseButton>
      </div>

      <template v-else>
        <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 md:p-8">
            <div class="mb-6">
              <h2 class="text-base font-semibold text-[var(--p-text)]">Public shop details</h2>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">What your shop is known for, where buyers can find you, and how fast you usually respond.</p>
            </div>

            <form class="space-y-5" novalidate @submit.prevent="saveProfile">
              <div
                v-if="saveError"
                class="rounded-xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-error)]"
              >
                {{ saveError }}
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <BaseInput
                  v-model="form.name"
                  label="Shop name"
                  placeholder="e.g. Nairobi Print Hub"
                  :error="fieldErrors.name"
                  required
                />
                <BaseInput
                  v-model="form.city"
                  label="Town or city"
                  placeholder="e.g. Nairobi"
                  :error="fieldErrors.city"
                />
                <BaseInput
                  v-model="form.state"
                  label="County / region"
                  placeholder="e.g. Nairobi County"
                  :error="fieldErrors.state"
                />
                <BaseInput
                  v-model="form.country"
                  label="Country"
                  placeholder="e.g. Kenya"
                  :error="fieldErrors.country"
                />
                <BaseInput
                  v-model="form.address_line"
                  label="Where buyers can find you"
                  placeholder="e.g. Kimathi Street, Nairobi CBD"
                  :error="fieldErrors.address_line"
                />
                <BaseInput
                  v-model="form.service_area"
                  label="What areas you serve"
                  placeholder="e.g. Nairobi CBD, Westlands, Kilimani, countrywide delivery"
                  :error="fieldErrors.service_area"
                />
                <BaseInput
                  v-model="form.turnaround_statement"
                  label="How fast you usually respond"
                  placeholder="e.g. Most small jobs are ready same day or next day"
                  :error="fieldErrors.turnaround_statement"
                />
                <BaseInput
                  v-model="form.opening_hours_text"
                  label="Opening hours summary"
                  placeholder="e.g. Mon-Sat, 8:00am-6:00pm"
                  :error="fieldErrors.opening_hours_text"
                />
                <BaseInput
                  v-model="form.public_whatsapp_number"
                  label="Public WhatsApp / business number"
                  placeholder="e.g. +254 700 000 000"
                  :error="fieldErrors.public_whatsapp_number"
                />
                <BaseInput
                  v-model="form.public_email"
                  label="Public email"
                  type="email"
                  placeholder="e.g. hello@yourprintshop.com"
                  :error="fieldErrors.public_email"
                />
              </div>

              <label class="flex flex-col gap-2 text-sm text-[var(--p-text-muted)]">
                <span class="font-medium text-[var(--p-text)]">Short description</span>
                <textarea
                  v-model="form.description"
                  rows="5"
                  class="min-h-32 rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg)] px-4 py-3 text-[var(--p-text)] outline-none transition placeholder:text-[var(--p-text-soft)] focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[color:var(--p-primary-soft)]"
                  placeholder="Tell buyers what your shop is known for, what you print best, and why they can trust your turnaround."
                />
              </label>

              <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--p-border)] px-4 py-4">
                <div
                  class="relative h-5 w-9 rounded-full transition-colors"
                  :class="form.is_public ? 'bg-[var(--p-primary)]' : 'bg-[var(--p-border)]'"
                  @click="form.is_public = !form.is_public"
                >
                  <div
                    class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                    :class="form.is_public ? 'translate-x-4' : 'translate-x-0.5'"
                  />
                </div>
                <span>
                  <span class="block text-sm font-medium text-[var(--p-text)]">Published</span>
                  <span class="mt-1 block text-sm text-[var(--p-text-muted)]">Only publish when these details are ready for buyers to see.</span>
                </span>
              </label>

              <div class="flex items-center gap-3 pt-2">
                <BaseButton type="submit" variant="primary" :loading="saving">Save profile</BaseButton>
                <span v-if="savedOk" class="flex items-center gap-1.5 text-xs font-medium text-green-600">
                  <Icon name="lucide:check" class="size-3.5" /> Saved
                </span>
              </div>
            </form>
          </div>

          <div class="space-y-6">
            <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
              <h2 class="text-base font-semibold text-[var(--p-text)]">Public preview</h2>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">This is the trust signal buyers will recognize first.</p>
              <div class="mt-5 space-y-4">
                <div>
                  <p class="text-lg font-semibold text-[var(--p-text)]">{{ form.name || 'Your shop name' }}</p>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ locationPreview }}</p>
                </div>
                <p class="text-sm leading-6 text-[var(--p-text-muted)]">
                  {{ form.description?.trim() || 'Add a short description so buyers know what your shop is known for.' }}
                </p>
                <div class="space-y-2 text-sm text-[var(--p-text-muted)]">
                  <p><span class="font-medium text-[var(--p-text)]">What areas you serve:</span> {{ form.service_area?.trim() || 'Not added yet' }}</p>
                  <p><span class="font-medium text-[var(--p-text)]">How fast you usually respond:</span> {{ form.turnaround_statement?.trim() || 'Not added yet' }}</p>
                  <p><span class="font-medium text-[var(--p-text)]">Where buyers can reach you:</span> {{ contactPreview }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
              <div class="mb-5">
                <h2 class="text-base font-semibold text-[var(--p-text)]">Opening hours</h2>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">These hours feed your public schedule summary.</p>
              </div>

              <div
                v-if="hoursError"
                class="mb-4 rounded-xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-error)]"
              >
                {{ hoursError }}
              </div>

              <div class="space-y-3">
                <div
                  v-for="day in hours"
                  :key="day.weekday"
                  class="flex flex-wrap items-center gap-3"
                >
                  <div class="w-28 shrink-0">
                    <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--p-text)]">
                      <div
                        class="relative h-5 w-9 rounded-full transition-colors"
                        :class="!day.is_closed ? 'bg-[var(--p-primary)]' : 'bg-[var(--p-border)]'"
                        @click="day.is_closed = !day.is_closed"
                      >
                        <div
                          class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                          :class="!day.is_closed ? 'translate-x-4' : 'translate-x-0.5'"
                        />
                      </div>
                      {{ day.weekday_display }}
                    </label>
                  </div>
                  <template v-if="!day.is_closed">
                    <input
                      v-model="day.from_hour"
                      type="time"
                      class="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] px-3 py-2 text-sm text-[var(--p-text)] focus:border-[var(--p-primary)] focus:outline-none"
                    />
                    <span class="text-xs text-[var(--p-text-muted)]">to</span>
                    <input
                      v-model="day.to_hour"
                      type="time"
                      class="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] px-3 py-2 text-sm text-[var(--p-text)] focus:border-[var(--p-primary)] focus:outline-none"
                    />
                  </template>
                  <span v-else class="text-xs text-[var(--p-text-muted)]">Closed</span>
                </div>
              </div>

              <div class="mt-5">
                <BaseButton variant="primary" size="sm" :loading="savingHours" @click="saveHours">Save hours</BaseButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import { useNotification } from '~/composables/useNotification'
import { useShopStore } from '~/stores/shop'
import type { OpeningHours, Shop } from '~/shared/types'

definePageMeta({ layout: 'dashboard' })

type HourRow = {
  weekday: number
  weekday_display: string
  from_hour: string
  to_hour: string
  is_closed: boolean
}

const shopStore = useShopStore()
const notification = useNotification()

const shopSlug = computed(() => shopStore.selectedShopSlug)
const currentShop = computed(() => shopStore.currentShop)

const loading = ref(false)
const loadError = ref('')
const saving = ref(false)
const savedOk = ref(false)
const saveError = ref('')
const savingHours = ref(false)
const hoursError = ref('')

const defaultHours = (): HourRow[] => ([
  { weekday: 1, weekday_display: 'Monday', from_hour: '08:00', to_hour: '18:00', is_closed: false },
  { weekday: 2, weekday_display: 'Tuesday', from_hour: '08:00', to_hour: '18:00', is_closed: false },
  { weekday: 3, weekday_display: 'Wednesday', from_hour: '08:00', to_hour: '18:00', is_closed: false },
  { weekday: 4, weekday_display: 'Thursday', from_hour: '08:00', to_hour: '18:00', is_closed: false },
  { weekday: 5, weekday_display: 'Friday', from_hour: '08:00', to_hour: '18:00', is_closed: false },
  { weekday: 6, weekday_display: 'Saturday', from_hour: '09:00', to_hour: '16:00', is_closed: false },
  { weekday: 7, weekday_display: 'Sunday', from_hour: '09:00', to_hour: '16:00', is_closed: true },
])

const hours = ref<HourRow[]>(defaultHours())

const form = reactive({
  name: '',
  description: '',
  address_line: '',
  city: '',
  state: '',
  country: 'Kenya',
  service_area: '',
  turnaround_statement: '',
  opening_hours_text: '',
  public_whatsapp_number: '',
  public_email: '',
  is_public: true,
})

const fieldErrors = reactive<Record<string, string>>({
  name: '',
  address_line: '',
  city: '',
  state: '',
  country: '',
  service_area: '',
  turnaround_statement: '',
  opening_hours_text: '',
  public_whatsapp_number: '',
  public_email: '',
})

const locationPreview = computed(() => {
  return [form.address_line, form.city, form.state, form.country].map(value => value.trim()).filter(Boolean).join(', ') || 'Location not added yet'
})

const contactPreview = computed(() => {
  const parts = [form.public_whatsapp_number.trim(), form.public_email.trim()].filter(Boolean)
  return parts.join(' • ') || 'No public contact added yet'
})

function resetFieldErrors() {
  Object.keys(fieldErrors).forEach(key => {
    fieldErrors[key] = ''
  })
}

function hydrateForm(shop: Shop | null) {
  if (!shop) return
  form.name = String(shop.name ?? '')
  form.description = String(shop.description ?? '')
  form.address_line = String(shop.address_line ?? '')
  form.city = String(shop.city ?? '')
  form.state = String(shop.state ?? '')
  form.country = String(shop.country ?? 'Kenya')
  form.service_area = String(shop.service_area ?? '')
  form.turnaround_statement = String(shop.turnaround_statement ?? '')
  form.opening_hours_text = String(shop.opening_hours_text ?? '')
  form.public_whatsapp_number = String(shop.public_whatsapp_number ?? '')
  form.public_email = String(shop.public_email ?? '')
  form.is_public = Boolean(shop.is_public)
}

function hydrateHours(source: OpeningHours[]) {
  const fallback = defaultHours()
  hours.value = fallback.map(day => {
    const found = source.find(item => Number(item.weekday) === day.weekday)
    return {
      weekday: day.weekday,
      weekday_display: String(found?.weekday_display ?? day.weekday_display),
      from_hour: String(found?.from_hour ?? day.from_hour).slice(0, 5),
      to_hour: String(found?.to_hour ?? day.to_hour).slice(0, 5),
      is_closed: Boolean(found?.is_closed),
    }
  })
}

async function loadProfile() {
  loading.value = true
  loadError.value = ''
  try {
    const activeShop = await shopStore.ensureActiveShop(shopSlug.value)
    const slug = activeShop?.slug ?? shopSlug.value
    if (!slug) {
      loadError.value = 'Select a shop before editing public details.'
      return
    }
    await Promise.all([
      shopStore.fetchShopBySlug(slug),
      shopStore.fetchShopHoursList(slug),
    ])
    hydrateForm(shopStore.currentShop)
    hydrateHours(shopStore.shopHours)
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load shop profile.'
  } finally {
    loading.value = false
  }
}

function validateForm() {
  resetFieldErrors()
  let valid = true

  if (!form.name.trim()) {
    fieldErrors.name = 'Shop name is required.'
    valid = false
  }
  if (form.public_email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.public_email.trim())) {
    fieldErrors.public_email = 'Enter a valid public email.'
    valid = false
  }

  return valid
}

async function saveProfile() {
  if (!validateForm()) return

  const slug = shopSlug.value
  if (!slug) return

  saveError.value = ''
  savedOk.value = false
  saving.value = true

  try {
    const result = await shopStore.updateShop(slug, {
      name: form.name,
      description: form.description,
      address_line: form.address_line,
      city: form.city,
      state: form.state,
      country: form.country,
      service_area: form.service_area,
      turnaround_statement: form.turnaround_statement,
      opening_hours_text: form.opening_hours_text,
      public_whatsapp_number: form.public_whatsapp_number,
      public_email: form.public_email,
      is_public: form.is_public,
    })
    if (!result.success) {
      saveError.value = result.error ?? 'Could not save public shop details.'
      Object.assign(fieldErrors, result.fieldErrors ?? {})
      return
    }

    hydrateForm(result.shop ?? shopStore.currentShop)
    savedOk.value = true
    notification.success('Public shop details saved.', 'Saved')
    setTimeout(() => { savedOk.value = false }, 3000)
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    saving.value = false
  }
}

async function saveHours() {
  const slug = shopSlug.value
  if (!slug) return

  hoursError.value = ''
  savingHours.value = true

  try {
    const payload = hours.value.map(day => ({
      weekday: day.weekday,
      from_hour: day.from_hour,
      to_hour: day.to_hour,
      is_closed: day.is_closed,
    }))
    const result = await shopStore.updateShopHoursBulk(slug, payload)
    if (!result.success) {
      hoursError.value = result.error ?? 'Could not save hours.'
      return
    }

    hydrateHours(shopStore.shopHours)
    notification.success('Opening hours saved.', 'Saved')
  } catch (err: unknown) {
    hoursError.value = err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    savingHours.value = false
  }
}

onMounted(loadProfile)
watch(shopSlug, loadProfile)
</script>
