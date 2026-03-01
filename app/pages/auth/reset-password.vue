<template>
  <div>
    <NuxtLayout name="auth" title="Reset password" subtitle="Enter your new password." back-to="/auth/login">
      <VeeForm v-slot="{ meta }" :validation-schema="schema" @submit="handleSubmit">
      <div class="space-y-4">
        <FormsFormInput
          name="new_password"
          label="New password"
          type="password"
          placeholder="••••••••"
          required
        />
        <FormsFormInput
          name="new_password_confirm"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          required
        />
        <UButton type="submit" color="primary" block :loading="loading" :disabled="!meta.valid">
          Reset password
        </UButton>
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
const notification = useNotification()
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
    notification.error('Invalid or missing reset link. Request a new one.')
    return
  }
  loading.value = true
  try {
    const result = await authStore.resetPassword(
      uid.value,
      token.value,
      newPassword,
      newPasswordConfirm
    )
    if (result.success) {
      notification.success('Password updated. You can sign in now.')
      await navigateTo('/auth/login')
    } else {
      notification.error(result.error ?? 'Reset failed.')
    }
  } catch {
    notification.error('Something went wrong.')
  } finally {
    loading.value = false
  }
}
</script>
