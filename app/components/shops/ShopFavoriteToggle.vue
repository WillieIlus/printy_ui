<template>
  <UButton
    :icon="isFav ? 'i-lucide-heart' : 'i-lucide-heart'"
    :color="isFav ? 'error' : 'neutral'"
    :variant="isFav ? 'soft' : 'ghost'"
    size="xs"
    :loading="toggling"
    :aria-label="isFav ? 'Remove from favorites' : 'Save shop'"
    @click="onToggle"
  />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps<{
  shopId: number
  shopName: string
  shopSlug: string
}>()

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const toast = useToast()

const isFav = computed(() => favoritesStore.isFavorite(props.shopId))
const toggling = ref(false)

async function onToggle() {
  if (!authStore.isAuthenticated) {
    toast.add({ title: 'Sign in to save shops', description: 'Create an account to save your favorite shops.', color: 'primary' })
    return
  }
  toggling.value = true
  try {
    const nowFav = await favoritesStore.toggleFavorite(props.shopId, props.shopName, props.shopSlug)
    toast.add({
      title: nowFav ? 'Shop saved' : 'Removed from favorites',
      color: nowFav ? 'success' : 'neutral',
    })
  } catch {
    toast.add({ title: 'Could not update', color: 'error' })
  } finally {
    toggling.value = false
  }
}
</script>
