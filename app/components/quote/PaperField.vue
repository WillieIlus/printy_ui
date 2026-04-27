<!-- Purpose: Starter quote field for paper stock selection. -->
<template>
  <BaseSelect v-model="selected" label="Paper stock" :options="options" />
</template>

<script setup lang="ts">
import BaseSelect from '~/components/ui/BaseSelect.vue'

const selected = ref('matte-300')

const options = [
  { label: '300gsm matte', value: 'matte-300' },
  { label: '250gsm silk', value: 'silk-250' },
  { label: 'Uncoated 170gsm', value: 'uncoated-170' },
]
</script>
