<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <FormsFormInput name="first_name" label="First name" placeholder="First name" />
        <FormsFormInput name="last_name" label="Last name" placeholder="Last name" />
      </div>
      <FormsFormInput name="phone" label="Phone" placeholder="+1 555 000 0000" />
      <FormsFormTextarea name="bio" label="Bio" placeholder="Short bio..." :rows="3" />
      <FormsFormInput name="address" label="Address" placeholder="Street address" />
      <div class="grid grid-cols-2 gap-4">
        <FormsFormInput name="city" label="City" placeholder="City" />
        <FormsFormInput name="state" label="State" placeholder="State" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <FormsFormInput name="country" label="Country" placeholder="Country" />
        <FormsFormInput name="postal_code" label="Postal code" placeholder="12345" />
      </div>

      <!-- Social links -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Social links</label>
        <div v-for="(link, index) in socialLinks" :key="index" class="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Link {{ index + 1 }}</span>
            <UButton
              v-if="socialLinks.length > 1"
              variant="ghost"
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
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 dark:border-primary-500'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'"
              >
                <input
                  type="radio"
                  :name="`social-platform-${index}`"
                  :value="platform.value"
                  :checked="link.platform === platform.value"
                  class="sr-only"
                  @change="updateSocialLinkPlatform(index, platform.value)"
                >
                <UIcon :name="platform.icon" class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span class="text-sm font-medium">{{ platform.label }}</span>
              </label>
            </template>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
            <UInput
              :model-value="link.url"
              placeholder="https://..."
              class="w-full"
              @update:model-value="(v: string) => updateSocialLinkUrl(index, v)"
            />
          </div>
        </div>
        <UButton variant="outline" size="sm" icon="i-lucide-plus" @click="addSocialLink">
          Add social link
        </UButton>
      </div>

      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">Save</UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { reactive, watch } from 'vue'
import type { Profile, UserUpdatePayload } from '~/shared/types'

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
  user?: { first_name?: string; last_name?: string } | null
  loading?: boolean
}>()
const emit = defineEmits<{ submit: [data: UserUpdatePayload]; cancel: [] }>()

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
    first_name: values.first_name as string,
    last_name: values.last_name as string,
    phone: values.phone as string,
    bio: values.bio as string,
    address: values.address as string,
    city: values.city as string,
    state: values.state as string,
    country: values.country as string,
    postal_code: values.postal_code as string,
    social_links: socialLinks.filter((l) => l.url?.trim()).map((l) => ({ platform: l.platform, url: l.url })),
  }
  emit('submit', payload)
}
</script>
