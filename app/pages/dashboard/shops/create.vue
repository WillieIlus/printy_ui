<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Register a Print Shop"
      subtitle="Create the business workspace first, then continue with machines, stock papers, parent sheet defaults, and product setup."
    >
      <template #actions>
        <UButton to="/dashboard/shops" variant="soft">Back to Shops</UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
      <DashboardFormSection
        title="Shop Details"
        description="Give Printy the details it needs to guide production, location confidence, and setup reminders."
      >
        <ShopsShopForm
          :loading="saving"
          :error="shopStore.error"
          :field-errors="shopStore.createFieldErrors"
          @submit="onSubmit"
          @cancel="() => navigateTo('/dashboard/shops')"
        />
      </DashboardFormSection>

      <div class="space-y-6">
        <DashboardInfoCard
          title="What happens next"
          description="After you save the shop, Printy will take you straight into setup so you can add machines, parent sheets, and the first sellable products."
          icon="i-lucide-route"
          tone="blue"
        />
        <DashboardInfoCard
          title="Saved on create"
          description="Shop details, contact information, and address fields now persist through the same create flow, so setup starts from real business data instead of a partial draft."
          icon="i-lucide-server"
          tone="blue"
        />
        <DashboardInfoCard
          title="Kenyan address examples"
          description="County: Nairobi. Town / Area: Westlands. Street / Building: Muthithi Road, Madonna House, 2nd Floor. Landmark: Opposite Sarit Centre."
          icon="i-lucide-map"
        />
        <DashboardInfoCard
          title="Manual address entry always works"
          description="Even if map search is unavailable, you can still create the shop with county, area, street/building, and an optional landmark or postal code."
          icon="i-lucide-map-pinned"
          tone="orange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopCreateInput } from '~/shared/types'
import { useNotification } from '~/composables/useNotification'
import { useSellerStore } from '~/stores/seller'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const notification = useNotification()
const shopStore = useShopStore()
const sellerStore = useSellerStore()
const saving = ref(false)

async function onSubmit(data: ShopCreateInput) {
  saving.value = true
  try {
    const result = await shopStore.createShop(data)
    if (!result.success || !result.shop) {
      if (!shopStore.createFieldErrors || Object.keys(shopStore.createFieldErrors).length === 0) {
        notification.error(shopStore.error ?? 'Shop creation failed. Please review the business details and try again.')
      }
      return
    }

    await sellerStore.fetchShops()
    notification.success(`"${result.shop.name}" was created and its business details were saved successfully.`)
    await navigateTo(`/dashboard/shops/${result.shop.slug}`)
  } catch (error) {
    notification.error(error instanceof Error ? error.message : 'Shop creation failed unexpectedly. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>
