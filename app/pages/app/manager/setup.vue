<script setup lang="ts">
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerPageHeader from '~/components/design/manager/ManagerPageHeader.vue'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Setup', to: '/app/manager/setup' }],
})

useHead({ title: 'Manager setup', meta: [{ name: 'robots', content: 'noindex' }] })

const links = [
  { href: '/app/manager/profile', title: 'Your profile', body: 'Name, photo, public listing and how clients reach you.' },
  { href: '/app/manager/rates', title: 'Pricing guidance', body: 'Default margin and the fair-price guidance for your quotes.' },
  { href: '/app/manager/clients', title: 'Clients', body: 'The clients you coordinate, their links and their jobs.' },
  { href: '/app/settings', title: 'Account settings', body: 'Phone, address, password and account details.' },
] as const
</script>

<template>
  <DesignManagerSurface>
    <div class="mx-auto flex w-full max-w-[900px] flex-col gap-6 pb-40">
      <DesignManagerPageHeader
        index="ST"
        kicker="Manager desk"
        title="Setup"
        description="Keep your profile, pricing guidance and client details in one place. Each card opens the existing form; nothing is duplicated here."
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="group rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-brand/60"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-[15px] font-bold tracking-tight">{{ link.title }}</h2>
              <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">{{ link.body }}</p>
            </div>
            <span class="font-mono text-[10px] text-ink-3 transition-colors group-hover:text-brand">Open</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </DesignManagerSurface>
</template>
