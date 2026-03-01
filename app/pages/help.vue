<template>
  <div class="py-12 sm:py-16">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#101828] dark:text-white sm:text-4xl">
        Help Center
      </h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Find answers and get support for Printy.
      </p>

      <div class="mt-10 space-y-8">
        <section>
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">Getting started</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Create an account, then set up your first shop. Add machines, materials, and finishing options. Configure your pricing logic (digital or large format). Once your shop is ready, customers can browse templates and request quotes.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">Pricing models</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong>Digital:</strong> Per sheet, per side. Best for SRA3, SRA4, and similar sheet-based work.<br>
            <strong>Large Format:</strong> Area-based (per m²). Best for banners, posters, signage.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">Templates and quotes</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Templates are pre-configured products (e.g., "Business Cards", "A3 Poster"). Customers select options and get an instant quote. You manage templates in your shop dashboard under Products.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">Need more help?</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Check the <NuxtLink to="/about" class="text-[#e13515] hover:underline font-medium">About</NuxtLink> page for an overview. For account or technical issues, contact support through your dashboard or email.
          </p>
        </section>
      </div>

      <div class="mt-10 flex flex-wrap gap-4">
        <NuxtLink to="/auth/signup" class="btn-primary inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold">
          Create account
          <UIcon name="i-lucide-arrow-right" class="ml-2 h-4 w-4" />
        </NuxtLink>
        <NuxtLink to="/gallery" class="inline-flex items-center rounded-xl border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          Browse Gallery
        </NuxtLink>
      </div>

      <NuxtLink to="/" class="mt-12 inline-flex items-center text-[#e13515] hover:underline font-medium">
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
</script>
