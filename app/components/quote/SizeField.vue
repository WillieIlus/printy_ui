<!-- Purpose: Starter quote field for print size. -->
<template>
  <BaseSelect v-model="selected" label="Size" :options="options" />
</template>

<script setup lang="ts">
import BaseSelect from '~/components/ui/BaseSelect.vue'

const selected = ref('a4')

const options = [
  { label: 'A4', value: 'a4' },
  { label: 'A5', value: 'a5' },
  { label: 'A3', value: 'a3' },
  { label: 'Custom', value: 'custom' },
]
</script>
