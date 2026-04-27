<!-- Purpose: Starter quote field for requested quantity. -->
<template>
  <BaseInput v-model="quantity" label="Quantity" type="number" placeholder="Enter quantity" />
</template>

<script setup lang="ts">
import BaseInput from '~/components/ui/BaseInput.vue'

const quantity = ref('500')
</script>
