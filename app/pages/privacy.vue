<template>
  <div class="py-12 sm:py-16">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#101828] dark:text-white sm:text-4xl">
        Privacy Policy
      </h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Last updated: {{ lastUpdated }}
      </p>
      <div class="mt-8 prose prose-gray dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
          Printy ("we", "our") respects your privacy. This policy describes how we collect, use, and protect your information.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">1. Information We Collect</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          We collect information you provide when registering (name, email, password) and when using the Service (shop data, quotes, usage). We use cookies and similar technologies for authentication and preferences.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">2. How We Use Your Information</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          We use your information to operate the Service, improve it, communicate with you, and comply with legal obligations.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">3. Data Sharing</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          We do not sell your personal data. We may share data with service providers who assist in operating the Service, under strict confidentiality.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">4. Security</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          We implement appropriate technical and organizational measures to protect your data.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">5. Your Rights</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          You may access, correct, or delete your personal data through your account settings. You may also contact us for assistance.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">6. Contact</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          For privacy-related questions, use the Help Center or contact us through your dashboard.
        </p>
      </div>
      <NuxtLink to="/" class="mt-10 inline-flex items-center text-[#e13515] hover:underline font-medium">
        <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
        Back to home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const lastUpdated = 'February 2025'
</script>
