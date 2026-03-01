<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="My Shops"
      subtitle="Manage your business listings"
    >
      <template #actions>
        <UButton to="/dashboard/shops/create" color="primary">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add New Shop
        </UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="sellerStore.loading" variant="cards" :card-count="6" />
    <div v-else-if="sellerStore.shops.length" class="col-span-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <div
        v-for="shop in sellerStore.shops"
        :key="shop.id"
        class="group relative flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/50 dark:hover:bg-flamingo-900/20"
      >
        <NuxtLink
          :to="`/dashboard/shops/${shop.slug}/setup`"
          class="flex min-w-0 flex-1 items-center gap-4"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40">
            <UIcon name="i-lucide-store" class="h-6 w-6 text-flamingo-600 dark:text-flamingo-400" />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ shop.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">/{{ shop.slug }}</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="h-5 w-5 text-gray-400 shrink-0" />
        </NuxtLink>
        <UButton
          variant="soft"
          size="sm"
          icon="i-lucide-pencil"
          aria-label="Edit shop"
          class="shrink-0 opacity-70 group-hover:opacity-100"
          @click="openEditModal(shop.slug)"
        />
      </div>
    </div>
    <div v-else class="col-span-12">
      <DashboardEmptyState
        title="No shops yet"
        description="Create your first shop to start receiving quotes and customers."
        icon="i-lucide-store"
      >
        <UButton to="/dashboard/shops/create" color="primary">Create Your First Shop</UButton>
      </DashboardEmptyState>
    </div>

    <DashboardModalForm
      v-model="editModalOpen"
      title="Edit shop"
      description="Update your shop details."
    >
      <CommonLoadingSpinner v-if="editModalOpen && shopStore.loading && !shopStore.currentShop" />
      <UAlert
        v-else-if="editModalOpen && shopStore.error && !shopStore.currentShop"
        color="error"
        variant="soft"
        :title="shopStore.error"
        icon="i-lucide-alert-circle"
        class="mb-4"
      >
        <template #description>
          <p class="mt-2 text-sm">The shop may not exist or the backend may not support slug-based lookup yet.</p>
          <UButton variant="soft" size="sm" class="mt-2" @click="closeEditModal">Close</UButton>
        </template>
      </UAlert>
      <ShopsShopForm
        v-else-if="editModalOpen && shopStore.currentShop"
        :key="shopStore.currentShop?.id ?? 'edit'"
        :shop="shopStore.currentShop"
        :loading="shopStore.loading"
        :error="shopStore.error"
        @submit="onEditSubmit"
        @cancel="closeEditModal"
      />
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import type { ShopCreateInput } from '~/shared/types'
import { useSellerStore } from '~/stores/seller'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const sellerStore = useSellerStore()
const shopStore = useShopStore()
const toast = useToast()

const editModalOpen = ref(false)

function openEditModal(slug: string) {
  router.replace({ path: '/dashboard/shops', query: { edit: slug } })
}

function closeEditModal() {
  editModalOpen.value = false
}

async function onEditSubmit(data: ShopCreateInput) {
  const editSlug = route.query.edit as string
  if (!editSlug) return
  const result = await shopStore.updateShop(editSlug, data)
  if (result.success) {
    toast.add({ title: 'Shop updated', color: 'success' })
    closeEditModal()
    await sellerStore.fetchShops()
  } else {
    toast.add({ title: 'Error', description: shopStore.error ?? 'Failed to update', color: 'error' })
  }
}

// Route is source of truth for "which shop to edit". Modal state syncs from route.
watch(
  () => route.query.edit as string | undefined,
  async (editSlug) => {
    if (editSlug) {
      await shopStore.fetchShopBySlug(editSlug)
      editModalOpen.value = true
    } else {
      editModalOpen.value = false
    }
  },
  { immediate: true }
)

// When modal closes (Cancel, outside click), clear the query so route stays in sync.
watch(editModalOpen, (open) => {
  if (!open && route.query.edit) {
    const q = { ...route.query }
    delete q.edit
    router.replace({ path: '/dashboard/shops', query: q })
  }
})

onMounted(async () => {
  await sellerStore.fetchShops()
  const editSlug = route.query.edit as string | undefined
  if (editSlug) {
    await shopStore.fetchShopBySlug(editSlug)
    editModalOpen.value = true
  }
})
</script>
