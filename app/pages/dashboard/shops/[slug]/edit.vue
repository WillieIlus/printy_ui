<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      :title="`Edit shop`"
      :subtitle="slug"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="shopStore.loading && !shopStore.currentShop" variant="block" />
    <div v-else-if="shopStore.currentShop" class="col-span-12">
      <ShopsShopForm
        :shop="shopStore.currentShop"
        :loading="shopStore.loading"
        :error="shopStore.error"
        @submit="onSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = route.params.slug as string

// Redirect to shops index with edit modal
await navigateTo({ path: '/dashboard/shops', query: { edit: slug } }, { replace: true })
</script>
