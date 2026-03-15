<template>
  <AdminLocationPicker
    :model-value="modelValue"
    @change="onChange"
  />
</template>

<script setup lang="ts">
export interface LocationPickerValue {
  address_line: string
  city: string
  state: string
  country: string
  zip_code?: string
  latitude: string
  longitude: string
  google_place_id: string
}

const props = defineProps<{
  modelValue?: Partial<LocationPickerValue>
}>()

const emit = defineEmits<{
  change: [value: LocationPickerValue]
}>()

// Sync to VeeForm when used inside a form (useForm from vee-validate)
const form = useForm<Record<string, unknown>>()

function onChange(value: LocationPickerValue) {
  emit('change', value)
  if (form?.setFieldValue) {
    form.setFieldValue('address_line', value.address_line)
    form.setFieldValue('city', value.city)
    form.setFieldValue('state', value.state)
    form.setFieldValue('country', value.country)
    form.setFieldValue('zip_code', value.zip_code ?? '')
    form.setFieldValue('latitude', value.latitude)
    form.setFieldValue('longitude', value.longitude)
    form.setFieldValue('google_place_id', value.google_place_id)
  }
}
</script>
