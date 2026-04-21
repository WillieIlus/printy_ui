<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" @submit="onSubmit">
    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        icon="i-lucide-alert-circle"
        title="Could not send reset link"
        :description="errorMessage"
        class="rounded-lg"
      />
      <UAlert
        v-if="successMessage"
        color="success"
        icon="i-lucide-check-circle"
        title="Reset email sent"
        :description="successMessage"
        class="rounded-lg"
      />
      <FormsFormInput name="email" label="Email" type="email" autocomplete="email" placeholder="Enter your email" icon="i-lucide-mail" required />
      <DashboardLoadingButton type="submit" color="primary" block class="bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl" :loading="loading" :disabled="!meta.valid">
        Send reset link
      </DashboardLoadingButton>
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
const feedback = useSubmissionFeedback()
const errorMessage = feedback.errorMessage
const successMessage = feedback.successMessage

const schema = object({
  email: string().email('Invalid email').required('Email is required'),
})

const authStore = useAuthStore()

async function onSubmit(values: Record<string, unknown>) {
  const { email } = values as { email: string }
  loading.value = true
  feedback.reset()
  authStore.error = null
  try {
    const result = await authStore.requestPasswordReset(email)
    if (result.success) {
      feedback.setSuccess('If an account exists, you will receive a reset link.', 'Reset email sent', false)
    } else {
      feedback.setError(result.error ?? 'We could not send the reset link right now.', 'Could not send reset link', false)
    }
  } catch {
    feedback.setError('Something went wrong. Try again.', 'Could not send reset link', false)
  } finally {
    loading.value = false
  }
}
</script>
