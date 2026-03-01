<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Team members"
      :subtitle="slug"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="loading" variant="block" />
    <div v-else class="col-span-12">
      <ShopsShopMembers :members="shopStore.shopMembers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const slug = computed(() => route.params.slug as string)
const loading = ref(true)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await shopStore.fetchShopMembers(slug.value)
  loading.value = false
})
</script>
