<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ShopsShopCard
      v-for="shop in shops"
      :key="shop.id"
      :shop="shop"
      :show-actions="showActions"
      @view="$emit('view', shop)"
      @edit="$emit('edit', shop)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Shop } from '~/shared/types'
defineProps<{ shops: Shop[]; showActions?: boolean }>()
defineEmits<{ view: [shop: Shop]; edit: [shop: Shop] }>()
</script>
