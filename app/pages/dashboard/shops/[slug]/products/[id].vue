<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Product template"
      :subtitle="slug"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/products`" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <div class="col-span-12">
      <p class="text-sm text-gray-500 dark:text-gray-400">Product detail / edit (wire to API by id).</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const _id = computed(() => route.params.id as string)
</script>
