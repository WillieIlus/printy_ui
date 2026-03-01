<script setup lang="ts">
interface Props {
  shopName?: string
  isPrinterOwner?: boolean
  shopSlug?: string
}

withDefaults(defineProps<Props>(), {
  shopName: 'This printer',
  isPrinterOwner: false,
  shopSlug: '',
})

const emit = defineEmits<{
  (e: 'browse-another-category'): void
}>()

function clearFilter() {
  emit('browse-another-category')
}
</script>

<template>
  <UCard
    class="overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
    :ui="{
      root: 'ring-0',
      body: 'p-8 sm:p-10',
    }"
  >
    <div class="flex flex-col items-center text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-flamingo-50 dark:bg-flamingo-950/50 text-flamingo-600 dark:text-flamingo-400"
      >
        <UIcon name="i-lucide-layout-template" class="h-10 w-10" />
      </div>
      <h2 class="mt-6 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        No templates yet
      </h2>
      <p class="mt-2 max-w-md text-base text-gray-600 dark:text-gray-400">
        {{ shopName }} hasn't published templates in this category yet.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <UButton
          color="primary"
          variant="soft"
          size="lg"
          class="rounded-xl"
          @click="clearFilter"
        >
          <UIcon name="i-lucide-layers" class="h-4 w-4 mr-2" />
          Browse another category
        </UButton>
        <NuxtLink to="/gallery">
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="rounded-xl w-full sm:w-auto"
          >
            <UIcon name="i-lucide-store" class="h-4 w-4 mr-2" />
            Browse other printers
          </UButton>
        </NuxtLink>
        <NuxtLink
          v-if="isPrinterOwner && shopSlug"
          :to="`/dashboard/shops/${shopSlug}/products/create`"
        >
          <UButton
            color="primary"
            variant="solid"
            size="lg"
            class="rounded-xl w-full sm:w-auto"
          >
            <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
            Add your first template
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </UCard>
</template>
