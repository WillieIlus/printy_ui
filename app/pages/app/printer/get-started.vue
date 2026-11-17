<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DesignPrinterSurface from '~/components/design/printer/PrinterSurface.vue'
import DesignPrinterSetupGuided from '~/components/design/printer/PrinterSetupGuided.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import { useApi } from '~/composables/useApi'
import { getApiErrorMessage } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { fromRateCard, type SetupBundle } from '~/utils/design/printer-setup'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Get started', to: '/app/printer/get-started' }],
})

const { api } = useApi()
const bundle = ref<SetupBundle | null>(null)
const loading = ref(true)
const errorText = ref('')

const shopName = computed(() => bundle.value?.setup.shopName || 'your print shop')

async function load() {
  loading.value = true
  errorText.value = ''
  try {
    const payload = await api<any>(API.rateCard.setup)
    bundle.value = fromRateCard(payload)
  } catch (error) {
    errorText.value = getApiErrorMessage(error, 'Your setup could not be loaded right now.')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <DesignPrinterSurface>
    <div class="flex flex-col gap-6">
      <DesignLoading v-if="loading" label="Loading your setup…" />
      <DesignAlert v-else-if="errorText" tone="error">
        <p>{{ errorText }}</p>
        <template #actions>
          <button class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white" @click="load">
            Try again
          </button>
        </template>
      </DesignAlert>
      <template v-else-if="bundle">
        <header>
          <DesignSectionLabel index="GS" tone="brand">Get started</DesignSectionLabel>
          <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Set up {{ shopName }}</h1>
          <p class="mt-1.5 max-w-xl text-[15px] font-light text-ink-2">
            Five short steps. Enter one printing price and we work the rest out. Confirm at the
            end and your shop becomes visible to managers.
          </p>
        </header>
        <DesignPrinterSetupGuided :initial="bundle" />
      </template>
    </div>
  </DesignPrinterSurface>
</template>
