<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-6">
      <!-- Personal Information -->
      <CommonSectionCard title="Personal Information" description="Your name and contact details.">
        <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <FormsFormInput name="first_name" label="First name" placeholder="First name" />
          <FormsFormInput name="last_name" label="Last name" placeholder="Last name" />
        </div>
        <div>
          <label :class="formLabelClass">Business Role</label>
          <USelectMenu
            v-model="selectedRole"
            :items="roleOptions"
            value-key="value"
            label-key="label"
            portal="body"
            class="w-full"
            :ui="dashboardSelectUi"
          />
        </div>
        <FormsFormInput name="phone" label="Phone" placeholder="+254 700 000 000" />
        <FormsFormTextarea name="bio" label="Bio" placeholder="Short bio..." :rows="3" />
      </div>
      </CommonSectionCard>

      <!-- Location -->
      <CommonSectionCard title="Address" description="Your postal address.">
        <div class="space-y-4">
          <FormsFormInput name="address" label="Address" placeholder="Street address" />
          <div class="grid grid-cols-2 gap-4">
            <FormsFormInput name="city" label="City" placeholder="City" />
            <FormsFormInput name="state" label="State" placeholder="State" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FormsFormInput name="country" label="Country" placeholder="Country" />
            <FormsFormInput name="postal_code" label="Postal code" placeholder="12345" />
          </div>
        </div>
      </CommonSectionCard>

      <!-- Social links -->
      <CommonSectionCard title="Social Links" description="Add links to your social profiles and website.">
        <div class="space-y-3">
          <div
            v-for="(link, index) in socialLinks"
            :key="index"
            :class="`flex flex-col gap-3 p-4 ${dashboardMutedPanelClass}`"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-[var(--p-text-muted)]">Link {{ index + 1 }}</span>
              <UButton
                v-if="socialLinks.length > 1"
                type="button"
                variant="soft"
                color="error"
                size="xs"
                icon="i-lucide-trash-2"
                aria-label="Remove link"
                @click="removeSocialLink(index)"
              />
            </div>
            <div class="flex flex-wrap gap-3">
              <template v-for="platform in SOCIAL_PLATFORMS" :key="platform.value">
                <label
                  class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors"
                  :class="link.platform === platform.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                    : 'border-[var(--p-border)] hover:border-[var(--p-text-muted)]'"
                >
                  <input
                    type="radio"
                    :name="`social-platform-${index}`"
                    :value="platform.value"
                    :checked="link.platform === platform.value"
                    class="sr-only"
                    @change="updateSocialLinkPlatform(index, platform.value)"
                  >
                  <UIcon :name="platform.icon" class="h-5 w-5 text-[var(--p-text-muted)]" />
                  <span class="text-sm font-medium text-[var(--p-text)]">{{ platform.label }}</span>
                </label>
              </template>
            </div>
            <div>
              <label :class="formLabelClass">URL</label>
              <UInput
                :model-value="link.url"
                placeholder="https://..."
                class="w-full"
                :ui="dashboardInputUi"
                @update:model-value="(v: string) => updateSocialLinkUrl(index, v)"
              />
            </div>
          </div>
          <UButton type="button" variant="soft" color="neutral" size="sm" icon="i-lucide-plus" @click="addSocialLink">
            Add social link
          </UButton>
        </div>
      </CommonSectionCard>

      <div class="flex justify-end gap-3 pt-2">
        <UButton type="button" variant="ghost" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">Save</UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { reactive, watch } from 'vue'
import type { Profile, UserUpdatePayload } from '~/shared/types'
import { dashboardInputUi, dashboardSelectUi, dashboardMutedPanelClass, formLabelClass } from '~/utils/formUi'
import { normalizeOptionalText } from '~/utils/payload'

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: 'i-simple-icons-facebook' },
  { value: 'twitter', label: 'X (Twitter)', icon: 'i-simple-icons-x' },
  { value: 'instagram', label: 'Instagram', icon: 'i-simple-icons-instagram' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'i-simple-icons-linkedin' },
  { value: 'youtube', label: 'YouTube', icon: 'i-simple-icons-youtube' },
  { value: 'tiktok', label: 'TikTok', icon: 'i-simple-icons-tiktok' },
  { value: 'pinterest', label: 'Pinterest', icon: 'i-simple-icons-pinterest' },
  { value: 'website', label: 'Website', icon: 'i-lucide-globe' },
] as const

const props = defineProps<{
  profile: Profile | null
  user?: { first_name?: string; last_name?: string; role?: 'client' | 'shop_owner' | 'staff' | 'CUSTOMER' | 'PRINTER' } | null
  loading?: boolean
}>()
const emit = defineEmits<{ submit: [data: UserUpdatePayload]; cancel: [] }>()

const roleOptions = [
  { label: 'Client', value: 'client' },
  { label: 'Shop owner', value: 'shop_owner' },
  { label: 'Staff', value: 'staff' },
]

const schema = object({
  first_name: string(),
  last_name: string(),
  phone: string(),
  bio: string(),
  address: string(),
  city: string(),
  state: string(),
  country: string(),
  postal_code: string(),
})

const socialLinks = reactive<Array<{ platform: string; url: string }>>([])
const selectedRole = ref<'client' | 'shop_owner' | 'staff'>('client')

const initialValues = computed(() => ({
  first_name: props.user?.first_name ?? '',
  last_name: props.user?.last_name ?? '',
  phone: props.profile?.phone ?? '',
  bio: props.profile?.bio ?? '',
  address: props.profile?.address ?? '',
  city: props.profile?.city ?? '',
  state: props.profile?.state ?? '',
  country: props.profile?.country ?? '',
  postal_code: props.profile?.postal_code ?? '',
}))

watch(
  () => props.profile?.social_links,
  (links) => {
    if (links?.length) {
      socialLinks.splice(0, socialLinks.length, ...links.map((l) => ({ platform: l.platform, url: l.url })))
    } else {
      socialLinks.splice(0, socialLinks.length)
    }
  },
  { immediate: true }
)

watch(
  () => props.user?.role,
  (role) => {
    if (role === 'PRINTER') {
      selectedRole.value = 'shop_owner'
      return
    }
    if (role === 'staff') {
      selectedRole.value = 'staff'
      return
    }
    selectedRole.value = role === 'shop_owner' ? 'shop_owner' : 'client'
  },
  { immediate: true }
)

function addSocialLink() {
  socialLinks.push({ platform: 'website', url: '' })
}

function removeSocialLink(index: number) {
  socialLinks.splice(index, 1)
}

function updateSocialLinkPlatform(index: number, platform: string) {
  socialLinks[index].platform = platform
}

function updateSocialLinkUrl(index: number, url: string) {
  socialLinks[index].url = url
}

function onSubmit(values: Record<string, unknown>) {
  const payload: UserUpdatePayload = {
    first_name: normalizeOptionalText(values.first_name) ?? '',
    last_name: normalizeOptionalText(values.last_name) ?? '',
    role: selectedRole.value,
    phone: normalizeOptionalText(values.phone) ?? '',
    bio: normalizeOptionalText(values.bio) ?? '',
    address: normalizeOptionalText(values.address) ?? '',
    city: normalizeOptionalText(values.city) ?? '',
    state: normalizeOptionalText(values.state) ?? '',
    country: normalizeOptionalText(values.country) ?? '',
    postal_code: normalizeOptionalText(values.postal_code) ?? '',
    social_links: socialLinks
      .map((link) => ({ platform: link.platform, url: normalizeOptionalText(link.url) ?? '' }))
      .filter((link) => link.url),
  }
  emit('submit', payload)
}
</script>
