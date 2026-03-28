<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Business hours"
      :subtitle="slug"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="soft" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="loading" variant="block" />
    <div v-else class="col-span-12">
      <ShopsShopHours
        :hours="shopStore.shopHours"
        :editable="true"
        :shop-slug="slug"
        @saved="handleSaved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useSetupStatus } from '~/composables/useSetupStatus'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const { refreshAndNavigate } = useSetupStatus()
const slug = computed(() => route.params.slug as string)
const loading = ref(true)

async function handleSaved() {
  await shopStore.fetchShopHoursList(slug.value)
  await refreshAndNavigate({
    shopSlug: slug.value,
    fallbackUrl: `/dashboard/shops/${slug.value}`,
    onlyWhenNextUrlChanges: true,
  })
}

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await shopStore.fetchShopHoursList(slug.value)
  loading.value = false
})
</script>
