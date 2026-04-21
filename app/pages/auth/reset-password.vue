<template>
  <div>
    <NuxtLayout name="auth" title="Reset password" subtitle="Enter your new password." back-to="/auth/login">
      <VeeForm v-slot="{ meta }" :validation-schema="schema" @submit="handleSubmit">
      <div class="space-y-4">
        <UAlert
          v-if="errorMessage"
          color="error"
          icon="i-lucide-alert-circle"
          title="Could not reset password"
          :description="errorMessage"
          class="rounded-lg"
        />
        <UAlert
          v-if="successMessage"
          color="success"
          icon="i-lucide-check-circle"
          title="Password updated"
          :description="successMessage"
          class="rounded-lg"
        />
        <FormsFormInput
          name="new_password"
          label="New password"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          required
        />
        <FormsFormInput
          name="new_password_confirm"
          label="Confirm password"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          required
        />
        <DashboardLoadingButton type="submit" color="primary" block :loading="loading" :disabled="!meta.valid">
          Reset password
        </DashboardLoadingButton>
      </div>
    </VeeForm>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { object, string, ref as yupRef } from 'yup'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const route = useRoute()
const authStore = useAuthStore()
const feedback = useSubmissionFeedback()
const errorMessage = feedback.errorMessage
const successMessage = feedback.successMessage
const loading = ref(false)

const token = computed(() => (route.query.token as string) ?? '')
const uid = computed(() => (route.query.uid as string) ?? '')

const schema = object({
  new_password: string().required('Password is required').min(8, 'At least 8 characters'),
  new_password_confirm: string()
    .required('Confirm password')
    .oneOf([yupRef('new_password')], 'Passwords must match'),
})

async function handleSubmit(values: Record<string, unknown>) {
  const newPassword = values.new_password as string
  const newPasswordConfirm = values.new_password_confirm as string
  if (!uid.value || !token.value) {
    feedback.setError('Invalid or missing reset link. Request a new one.')
    return
  }
  loading.value = true
  feedback.reset()
  try {
    const result = await authStore.resetPassword(
      uid.value,
      token.value,
      newPassword,
      newPasswordConfirm
    )
    if (result.success) {
      feedback.setSuccess('Password updated. You can sign in now.')
      await navigateTo('/auth/login')
    } else {
      feedback.setError(result.error ?? 'We could not reset your password right now.')
    }
  } catch {
    feedback.setError('Something went wrong.')
  } finally {
    loading.value = false
  }
}
</script>
