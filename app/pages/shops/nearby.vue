<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shops nearby</h1>
      <p class="text-gray-600 dark:text-gray-400">Find print shops near you. We'll use your location when you allow it.</p>
    </div>
    <div v-if="locationError" class="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-200">
      {{ locationError }}
      <UButton variant="ghost" size="sm" class="mt-2" @click="requestLocation">Try again</UButton>
    </div>
    <ShopsNearbyShops :shops="shopStore.nearbyShops" :loading="shopStore.loading" />
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({ layout: 'default' })

const shopStore = useShopStore()
const locationError = ref<string | null>(null)

function requestLocation() {
  locationError.value = null
  if (!import.meta.client || !navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by your browser.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      shopStore.fetchNearbyShops({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        radius: 25,
      })
    },
    (err) => {
      locationError.value = err.message === 'User denied Geolocation'
        ? 'Location was denied. Enable location access to see nearby shops.'
        : 'Could not get your location. Try again or browse all shops.'
    }
  )
}

onMounted(() => {
  requestLocation()
})
</script>
