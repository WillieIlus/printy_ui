<template>
  <CommonSimpleModal
    :open="open"
    title="Send Beta Feedback"
    description="Help us improve Printy. Your feedback is valuable."
    @update:open="$emit('update:open', $event)"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rating (optional)
        </label>
        <div class="flex gap-1">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="p-2 rounded-lg transition-colors"
            :class="rating === n
              ? 'bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            @click="rating = n"
          >
            <UIcon name="i-lucide-star" class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message <span class="text-red-500">*</span>
        </label>
        <UTextarea
          v-model="message"
          placeholder="Tell us what you think, what works, what doesn't..."
          :rows="4"
          class="w-full"
          :class="{ 'ring-red-500': errors.message }"
        />
        <p v-if="errors.message" class="mt-1 text-sm text-red-500">
          {{ errors.message }}
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Minimum 10 characters
        </p>
      </div>
      <div class="flex gap-2 justify-end pt-2">
        <UButton
          color="neutral"
          variant="outline"
          @click="$emit('update:open', false)"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="!message.trim() || message.trim().length < 10"
        >
          Send Feedback
        </UButton>
      </div>
    </form>
  </CommonSimpleModal>
</template>

<script setup lang="ts">
import { parseApiError } from '~/utils/api-error'

const props = defineProps<{
  open: boolean
  page?: string
  userAgent?: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { post } = useApi()
const toast = useToast()

const message = ref('')
const rating = ref<number | null>(null)
const loading = ref(false)
const errors = ref<{ message?: string }>({})

function reset() {
  message.value = ''
  rating.value = null
  errors.value = {}
}

async function submit() {
  const msg = message.value.trim()
  if (msg.length < 10) {
    errors.value = { message: 'Message must be at least 10 characters.' }
    return
  }
  errors.value = {}
  loading.value = true
  try {
    await post('beta-feedback/', {
      message: msg,
      rating: rating.value ?? undefined,
      page: props.page ?? undefined,
      user_agent: props.userAgent ?? undefined,
    })
    toast.add({
      title: 'Thank you!',
      description: 'Your feedback has been sent.',
    })
    reset()
    emit('update:open', false)
  } catch (err) {
    const msg = parseApiError(err, 'Failed to send feedback')
    toast.add({ title: 'Error', description: msg, color: 'error' })
    errors.value = { message: msg }
  } finally {
    loading.value = false
  }
}

watch(() => props.open, (isOpen) => {
  if (!isOpen) reset()
})
</script>
