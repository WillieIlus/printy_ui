<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" @submit="onSubmit">
    <div class="space-y-4">
      <UAlert
        v-if="authStore.error"
        color="error"
        icon="i-lucide-alert-circle"
        :title="authStore.error"
        class="rounded-lg"
        close
        @update:open="(open) => { if (!open) authStore.error = null }"
      />
      <FormsFormInput name="email" label="Email" type="email" placeholder="Enter your email" icon="i-lucide-mail" required />
      <UButton type="submit" color="primary" block :loading="loading" :disabled="!meta.valid">
        Send reset link
      </UButton>
      <p class="text-center text-sm text-slate-600 dark:text-slate-400">
        <NuxtLink to="/auth/login" class="text-primary-600 hover:underline font-medium dark:text-primary-400">Back to sign in</NuxtLink>
      </p>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { useAuthStore } from '~/stores/auth'

const loading = ref(false)
const notification = useNotification()

const schema = object({
  email: string().email('Invalid email').required('Email is required'),
})

const authStore = useAuthStore()

async function onSubmit(values: Record<string, unknown>) {
  const { email } = values as { email: string }
  loading.value = true
  try {
    const result = await authStore.requestPasswordReset(email)
    if (result.success) {
      notification.success('If an account exists, you will receive a reset link.')
    } else {
      notification.error(result.error ?? 'Request failed.')
    }
  } catch {
    notification.error('Something went wrong. Try again.')
  } finally {
    loading.value = false
  }
}
</script>
