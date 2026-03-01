<template>
  <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-8 sm:p-10 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-flamingo-500 to-flamingo-700 text-white shadow-lg shadow-flamingo-500/25">
        <UIcon name="i-lucide-store" class="h-8 w-8" />
      </div>
      <h1 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
        You're almost ready — create your print shop
      </h1>
      <p class="mt-3 text-gray-600 dark:text-gray-400">
        Set up your first shop to start receiving quotes and customers. It only takes a few minutes.
      </p>
      <div class="mt-8">
        <UButton
          color="primary"
          size="lg"
          @click="modalOpen = true"
        >
          <UIcon name="i-lucide-plus" class="h-5 w-5 mr-2" />
          Create Shop
        </UButton>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-500">
        <NuxtLink to="/dashboard" class="text-primary-600 hover:underline dark:text-primary-400">
          Skip for now
        </NuxtLink>
      </p>
    </div>

    <DashboardModalForm
      v-model="modalOpen"
      title="Create shop"
      description="Add your first business listing to start receiving quotes."
    >
      <ShopsShopForm
        v-if="formReady"
        :loading="formLoading"
        :error="shopStore.error"
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import type { ShopCreateInput } from '~/shared/types'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const shopStore = useShopStore()
const notification = useNotification()

const modalOpen = ref(false)
const formReady = ref(false)
const formLoading = ref(false)

watch(modalOpen, (open) => {
  if (open) {
    formReady.value = false
    nextTick(() => { formReady.value = true })
  } else {
    formReady.value = false
  }
})

function closeModal() {
  modalOpen.value = false
}

async function onSubmit(data: ShopCreateInput) {
  formLoading.value = true
  try {
    const result = await shopStore.createShop(data)
    if (result.success && result.shop) {
      notification.success('Shop created! Add machines, then stock and prices.')
      closeModal()
      await navigateTo('/dashboard')
    } else {
      notification.error(shopStore.error ?? 'Create failed')
    }
  } finally {
    formLoading.value = false
  }
}

onMounted(() => shopStore.fetchMyShops())
</script>
