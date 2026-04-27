<!-- Purpose: Starter quote field for finishing preference. -->
<template>
  <BaseSelect v-model="selected" label="Finishing" :options="options" />
</template>

<script setup lang="ts">
import BaseSelect from '~/components/ui/BaseSelect.vue'

const selected = ref('none')

const options = [
  { label: 'No finishing', value: 'none' },
  { label: 'Gloss lamination', value: 'gloss' },
  { label: 'Matt lamination', value: 'matt' },
  { label: 'Spot UV', value: 'spot-uv' },
]
</script>
