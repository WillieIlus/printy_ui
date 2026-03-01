<template>
  <div class="py-12 sm:py-16">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#101828] dark:text-white sm:text-4xl">
        About Printy
      </h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Your Price, Instantly. The intelligent quoting and pricing engine for modern print shops.
      </p>

      <div class="mt-10 space-y-10">
        <section>
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">What is Printy?</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Printy is not a marketplace. It is a pricing brain that helps print shops generate fast, accurate quotes using their own machines, materials, and operational costs. Shops configure their pricing logic once; customers get instant, consistent quotes.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">How it works</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Two engines drive the pricing: Digital (sheet-based, per side) and Large Format (area-based, per m²). Finishing options attach cleanly to both. Shops define materials, click costs, and finishing rules. Customers browse templates and get a quote in seconds.
          </p>
        </section>

        <section id="mock-templates" class="scroll-mt-24">
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">Mock Templates</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Mock templates are sample product configurations that demonstrate how Printy calculates quotes. They use placeholder pricing to illustrate the flow: customer selects options, system applies your shop's logic, and returns a price. Browse the <NuxtLink to="/gallery" class="text-[#e13515] hover:underline font-medium">Template Gallery</NuxtLink> to see mock templates from different shops.
          </p>
          <NuxtLink to="/gallery" class="mt-4 inline-flex items-center rounded-xl bg-[#e13515] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c92f13] transition-colors">
            Browse Gallery
            <UIcon name="i-lucide-chevron-right" class="ml-2 h-4 w-4" />
          </NuxtLink>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-[#101828] dark:text-white">Get started</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Create an account, set up your first shop, and start generating quotes. No long-term commitment required.
          </p>
          <NuxtLink to="/auth/signup" class="mt-4 inline-flex items-center rounded-xl bg-[#e13515] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c92f13] transition-colors">
            Create your shop
            <UIcon name="i-lucide-arrow-right" class="ml-2 h-4 w-4" />
          </NuxtLink>
        </section>
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
