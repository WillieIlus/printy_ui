<template>
  <VeeForm v-slot="{ meta }" :validation-schema="signupSchema" @submit="onSubmit">
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
      <div class="grid grid-cols-2 gap-4">
        <FormsFormInput name="first_name" label="First Name" placeholder="John" icon="i-lucide-user" />
        <FormsFormInput name="last_name" label="Last Name" placeholder="Doe" icon="i-lucide-user" />
      </div>
      <FormsFormInput name="email" label="Email" type="email" placeholder="john@example.com" icon="i-lucide-mail" />
      <FormsFormInput name="password" label="Password" type="password" placeholder="Create a password" icon="i-lucide-lock" />
      <FormsFormInput name="password_confirm" label="Confirm Password" type="password" placeholder="Confirm your password" icon="i-lucide-lock" />
      <label class="flex items-start gap-2">
        <UCheckbox v-model="agreeTerms" class="mt-1" />
        <span class="text-sm text-gray-600 dark:text-gray-400">
          I agree to the <NuxtLink to="/terms" class="text-[#e13515] hover:underline dark:text-primary-400">Terms of Service</NuxtLink>
          and <NuxtLink to="/privacy" class="text-[#e13515] hover:underline dark:text-primary-400">Privacy Policy</NuxtLink>
        </span>
      </label>
      <UButton type="submit" color="primary" block :loading="loading" :disabled="!meta.valid || !agreeTerms">
        Create Account
      </UButton>
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-primary-600 hover:underline font-medium dark:text-primary-400">Sign in</NuxtLink>
      </p>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string, ref as yupRef } from 'yup'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { signup, loading } = useAuth()
const notification = useNotification()
const agreeTerms = ref(false)

const signupSchema = object({
  first_name: string().required('First name is required'),
  last_name: string().required('Last name is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  password_confirm: string()
    .oneOf([yupRef('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

async function onSubmit(values: Record<string, unknown>) {
  const result = await signup(values as {
    first_name: string
    last_name: string
    email: string
    password: string
    password_confirm: string
  })
  if (!result.success) {
    notification.error(result.error || 'Signup failed')
  } else {
    notification.success(
      (result as { message?: string }).message ?? 'Account created. Please check your email to confirm.'
    )
  }
}
</script>
