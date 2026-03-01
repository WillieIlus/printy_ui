<template>
  <div class="py-12 sm:py-16">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#101828] dark:text-white sm:text-4xl">
        Terms of Service
      </h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Last updated: {{ lastUpdated }}
      </p>
      <div class="mt-8 prose prose-gray dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
          By using Printy ("the Service"), you agree to these Terms of Service. Please read them carefully.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">1. Acceptance of Terms</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          By accessing or using Printy, you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">2. Description of Service</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Printy provides quoting and pricing tools for print shops. It is not a marketplace—it is a pricing engine that helps shops generate fast, accurate quotes.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">3. Account and Responsibility</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          You are responsible for maintaining the confidentiality of your account and for all activities under your account.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">4. Changes</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          We may modify these Terms from time to time. Continued use of the Service after changes constitutes acceptance.
        </p>
        <h2 class="mt-8 text-xl font-semibold text-[#101828] dark:text-white">5. Contact</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          For questions about these Terms, please contact us through the Help Center or your account dashboard.
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
