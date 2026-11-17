<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerProfileEditor from '~/components/design/manager/ManagerProfileEditor.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'My profile', to: '/app/manager/profile' }],
})

const { api } = useApi()
const bundle = ref<any>(null)
const loading = ref(true)
const errorText = ref('')

async function load() {
  loading.value = true
  errorText.value = ''
  try {
    bundle.value = await api(API.profile.managerProfile)
  } catch (error) {
    errorText.value = getApiErrorMessage(error, 'Your profile could not be loaded right now.')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <DesignManagerSurface>
    <div class="flex flex-col gap-6">
      <DesignLoading v-if="loading" label="Loading your profile…" />
      <DesignAlert v-else-if="errorText" tone="error">
        <p>{{ errorText }}</p>
        <template #actions>
          <button class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white" @click="load">Try again</button>
        </template>
      </DesignAlert>
      <template v-else-if="bundle">
        <header>
          <DesignSectionLabel index="MP" tone="brand">My profile</DesignSectionLabel>
          <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">How clients see you</h1>
          <p class="mt-1.5 max-w-xl text-[15px] font-light text-ink-2">
            A real face and credible details win jobs. Private fields stay private; new headshots
            go live after admin approval.
          </p>
        </header>
        <DesignManagerProfileEditor :initial="bundle" />
      </template>
    </div>
  </DesignManagerSurface>
</template>
