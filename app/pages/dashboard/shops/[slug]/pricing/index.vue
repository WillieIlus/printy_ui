<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">Rate Card / Pricing Setup</h1>
        <p class="mt-1 text-[var(--p-text-muted)]">Use one clear save flow for pricing: edit in a modal, review feedback, then save to your shop.</p>
      </div>
      <div class="flex gap-2">
        <UButton
          variant="outline"
          size="sm"
          :loading="defaultsLoading"
          @click="openViewDefaults"
        >
          <UIcon name="i-lucide-file-text" class="w-4 h-4 mr-2" />
          View defaults
        </UButton>
        <UButton :to="`/dashboard/shops/${slug}`" variant="soft" size="sm">Back</UButton>
        <UButton :to="`/shops/${slug}`" target="_blank" variant="outline" class="rounded-xl border-[var(--p-border)] hover:border-flamingo-300 hover:bg-flamingo-50 hover:text-flamingo-600 dark:hover:border-flamingo-600 dark:hover:bg-flamingo-900/30 dark:hover:text-flamingo-400">
          <UIcon name="i-lucide-eye" class="w-4 h-4 mr-2" />
          Preview Public Page
        </UButton>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
      <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <p class="text-sm font-semibold text-[var(--p-text-dim)]">Pricing workflow</p>
            <h2 class="text-lg font-semibold text-[var(--p-text)]">Add, review, save</h2>
            <p class="text-sm leading-6 text-[var(--p-text-muted)]">
              Printing, paper, finishing, and discounts now follow the same pattern: open a form, make changes, click Save, and see clear inline feedback if anything fails.
            </p>
          </div>
          <UBadge color="primary" variant="soft">Explicit save only</UBadge>
        </div>
      </div>
      <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5">
        <p class="text-sm font-semibold text-[var(--p-text-dim)]">Focus first</p>
        <ul class="mt-3 space-y-2 text-sm text-[var(--p-text-muted)]">
          <li>Set machine printing rates before publishing sheet products.</li>
          <li>Add paper prices that match the stock you actually sell.</li>
          <li>Use finishing services and discounts only when those offers are ready for buyers.</li>
        </ul>
      </div>
    </div>

    <!-- Empty pricing: Setup incomplete warning -->
    <div
      v-if="!loading && !pricingStore.hasPricing"
      class="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
            <UIcon name="i-lucide-alert-triangle" class="inline w-4 h-4 mr-1" />
            Setup incomplete: add pricing
          </p>
          <p class="mt-1 text-sm text-amber-700 dark:text-amber-300">
            Without pricing, customers won't be able to request quotes. Load starter defaults below, then adjust prices to match your shop.
          </p>
        </div>
        <UButton
          class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600 shrink-0"
          :loading="seedLoading"
          @click="loadStarterDefaults"
        >
          <UIcon name="i-lucide-download" class="w-4 h-4 mr-2" />
          Load starter defaults
        </UButton>
      </div>
    </div>

    <!-- Needs review warning -->
    <div
      v-if="!loading && pricingStore.hasPricing && pricingStore.hasNeedsReview"
      class="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4"
    >
      <p class="text-sm text-amber-800 dark:text-amber-200">
        <UIcon name="i-lucide-alert-triangle" class="inline w-4 h-4 mr-1" />
        Starter prices loaded—adjust before using
      </p>
      <p class="mt-1 text-sm text-amber-700 dark:text-amber-300">
        Edit any price row to confirm and remove the review flag.
      </p>
    </div>

    <!-- Error state -->
    <div
      v-if="pricingStore.error"
      class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4"
    >
      <p class="text-sm text-red-800 dark:text-red-200">
        <UIcon name="i-lucide-alert-circle" class="inline w-4 h-4 mr-1" />
        {{ pricingStore.error }}
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 overflow-x-auto rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        :class="activeTab === tab.id
          ? 'bg-flamingo-500 text-white shadow-sm'
          : 'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)]'"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Loading State -->
    <DashboardSkeletonState v-if="loading" variant="table" :show-header="false" class="col-span-12" />

    <!-- Tab Content -->
    <template v-else>
      <!-- Printing (Machines) Tab -->
      <div v-if="activeTab === 'printing'" class="space-y-4">
        <div v-if="!machineStore.machines.length" class="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <p class="text-sm text-amber-800 dark:text-amber-200">
            <UIcon name="i-lucide-alert-circle" class="inline w-4 h-4 mr-1" />
            Add machines first in <NuxtLink :to="`/dashboard/shops/${slug}/machines`" class="font-semibold text-amber-700 dark:text-amber-300 hover:underline">Machines</NuxtLink> before setting printing prices.
          </p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">Set the price per printed side for each paper size and color mode.</p>
          <UButton
            class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
            :disabled="!machineStore.machines.length"
            @click="openPrintingModal()"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Printing Price
          </UButton>
        </div>

        <div v-if="pricingStore.printingPrices.length" class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Color</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sell Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Profit</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Active</th>
                <th class="px-4 py-3" />
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="price in pricingStore.printingPrices" :key="price.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ price.sheet_size }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ price.color_mode }}</td>
                <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">KES {{ price.selling_price_per_side }}</td>
                <td class="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">{{ price.buying_price_per_side ? `KES ${price.buying_price_per_side}` : '-' }}</td>
                <td class="px-4 py-3 text-sm text-right text-green-600">KES {{ price.profit_per_side }}</td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <UBadge :color="price.is_active ? 'success' : 'neutral'" variant="soft">
                      {{ price.is_active ? 'Yes' : 'No' }}
                    </UBadge>
                    <UBadge v-if="price.needs_review" color="warning" variant="soft" size="xs">Review</UBadge>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <UButton variant="soft" size="xs" @click="editPrintingPrice(price)">Edit</UButton>
                  <UButton variant="soft" size="xs" color="error" @click="deletePrintingPrice(price.id)">Delete</UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonEmptyState v-else title="No printing prices" description="Add machines first, then add printing prices per machine and paper size.">
          <NuxtLink v-if="!machineStore.machines.length" :to="`/dashboard/shops/${slug}/machines`">
            <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600">Add machines first</UButton>
          </NuxtLink>
          <UButton
            v-else
            class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
            @click="openPrintingModal()"
          >
            Add first printing price
          </UButton>
        </CommonEmptyState>
      </div>

      <!-- Paper Prices -->
      <div v-if="activeTab === 'paper'" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">Set paper prices by GSM (weight). Customers see this as their rate card.</p>
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openPaperModal()">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Paper Price
          </UButton>
        </div>

        <div v-if="pricingStore.paperPrices.length" class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">GSM</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sell Price</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Profit</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Margin</th>
                <th class="px-4 py-3" />
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="price in pricingStore.paperPrices" :key="price.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ price.gsm }} gsm</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ price.sheet_size }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ price.paper_type }}</td>
                <td class="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">KES {{ price.buying_price }}</td>
                <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">KES {{ price.selling_price }}</td>
                <td class="px-4 py-3 text-sm text-right text-green-600">KES {{ price.profit }}</td>
                <td class="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">{{ parseFloat(price.margin_percent).toFixed(1) }}%</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <UBadge v-if="price.needs_review" color="warning" variant="soft" size="xs">Review</UBadge>
                    <UButton variant="soft" size="xs" @click="editPaperPrice(price)">Edit</UButton>
                    <UButton variant="soft" size="xs" color="error" @click="deletePaperPrice(price.id)">Delete</UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonEmptyState v-else title="No paper prices" description="Add paper prices by GSM to create your rate card.">
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openPaperModal()">Add First Paper Price</UButton>
        </CommonEmptyState>
      </div>

      <!-- Finishing Services -->
      <div v-if="activeTab === 'finishing'" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">Add finishing services like lamination, binding, and cutting.</p>
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openFinishingModal()">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Finishing Service
          </UButton>
        </div>

        <div v-if="pricingStore.finishingServices.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="service in pricingStore.finishingServices" 
            :key="service.id" 
            class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ service.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ service.category }}</p>
              </div>
              <div class="flex gap-1">
                <UBadge v-if="service.is_default" color="info" variant="soft" size="xs">Default</UBadge>
                <UBadge v-if="service.needs_review" color="warning" variant="soft" size="xs">Review</UBadge>
              </div>
            </div>
            <div class="mt-3 flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">KES {{ service.selling_price }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ service.charge_by.replace('PER_', '').toLowerCase() }}</span>
            </div>
            <div class="mt-3 flex gap-2">
              <UButton variant="soft" size="xs" @click="editFinishingService(service)">Edit</UButton>
              <UButton variant="soft" size="xs" color="error" @click="deleteFinishingService(service.id)">Delete</UButton>
            </div>
          </div>
        </div>
        <CommonEmptyState v-else title="No finishing services" description="Add services like lamination and binding.">
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openFinishingModal()">Add First Finishing Service</UButton>
        </CommonEmptyState>
      </div>

      <!-- Volume Discounts -->
      <div v-if="activeTab === 'discounts'" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">Set up bulk discounts for large orders.</p>
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openDiscountModal()">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
            Add Volume Discount
          </UButton>
        </div>

        <div v-if="pricingStore.volumeDiscounts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="discount in pricingStore.volumeDiscounts" 
            :key="discount.id" 
            class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <h3 class="font-medium text-gray-900 dark:text-white">{{ discount.name }}</h3>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{{ discount.discount_percent }}% OFF</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Min. {{ discount.min_quantity }} items</p>
            <div class="mt-3 flex gap-2">
              <UButton variant="soft" size="xs" @click="editDiscount(discount)">Edit</UButton>
              <UButton variant="soft" size="xs" color="error" @click="deleteDiscount(discount.id)">Delete</UButton>
            </div>
          </div>
        </div>
        <CommonEmptyState v-else title="No volume discounts" description="Encourage bulk orders with volume discounts.">
          <UButton class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600" @click="openDiscountModal()">Add First Discount</UButton>
        </CommonEmptyState>
      </div>
    </template>

    <!-- Modals with table-style forms -->
    <DashboardModalForm
      v-model="printingModalOpen"
      :title="editingPrintingPrice ? 'Edit Printing Price' : 'Add Printing Price'"
      :description="editingPrintingPrice ? 'Edit price per printed side.' : 'Set price per printed side for paper size and color mode.'"
    >
      <PricingPrintingPriceForm
        v-if="printingFormReady"
        :key="editingPrintingPrice?.id ?? 'new'"
        :price="editingPrintingPrice"
        :machine-options="machineOptions"
        :loading="formLoading"
        :error-message="printingFeedback.errorMessage.value"
        :field-errors="printingFeedback.fieldErrors.value"
        @submit="submitPrintingPrice"
        @cancel="closePrintingModal"
      />
    </DashboardModalForm>
    <DashboardModalForm
      v-model="paperModalOpen"
      :title="editingPaperPrice ? 'Edit Paper Price' : 'Add Paper Price'"
      :description="editingPaperPrice ? 'Edit paper price by GSM.' : 'Set paper price by GSM for your rate card.'"
    >
      <PricingPaperPriceForm
        v-if="paperFormReady"
        :key="editingPaperPrice?.id ?? 'new'"
        :price="editingPaperPrice"
        :loading="formLoading"
        :error-message="paperFeedback.errorMessage.value"
        :field-errors="paperFeedback.fieldErrors.value"
        @submit="submitPaperPrice"
        @cancel="closePaperModal"
      />
    </DashboardModalForm>
    <DashboardModalForm
      v-model="finishingModalOpen"
      :title="editingFinishingService ? 'Edit Finishing Service' : 'Add Finishing Service'"
      :description="editingFinishingService ? 'Edit finishing service details.' : 'Add finishing services like lamination and binding.'"
    >
      <PricingFinishingServiceForm
        v-if="finishingFormReady"
        :key="editingFinishingService?.id ?? 'new'"
        :service="editingFinishingService"
        :loading="formLoading"
        :error-message="finishingFeedback.errorMessage.value"
        :field-errors="finishingFeedback.fieldErrors.value"
        @submit="submitFinishingService"
        @cancel="closeFinishingModal"
      />
    </DashboardModalForm>
    <DashboardModalForm
      v-model="discountModalOpen"
      :title="editingDiscount ? 'Edit Volume Discount' : 'Add Volume Discount'"
      :description="editingDiscount ? 'Edit bulk discount details.' : 'Set up bulk discounts for large orders.'"
    >
      <PricingVolumeDiscountForm
        v-if="discountFormReady"
        :key="editingDiscount?.id ?? 'new'"
        :discount="editingDiscount"
        :loading="formLoading"
        :error-message="discountFeedback.errorMessage.value"
        :field-errors="discountFeedback.fieldErrors.value"
        @submit="submitVolumeDiscount"
        @cancel="closeDiscountModal"
      />
    </DashboardModalForm>

    <!-- View defaults modal (read-only) -->
    <DashboardModalForm
      v-model="viewDefaultsOpen"
      title="Starter pricing defaults"
      description="Reference templates you can load into your shop. These are read-only."
    >
      <div class="space-y-6 max-h-[60vh] overflow-y-auto">
        <div v-if="defaultsLoading" class="py-8 text-center">
          <CommonLoadingSpinner />
        </div>
        <template v-else>
          <div v-if="pricingStore.defaultPrinting.length" class="space-y-2">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Printing</h4>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
              <table class="min-w-full">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Size</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Color</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-500">Sell/side</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                  <tr v-for="(t, i) in pricingStore.defaultPrinting" :key="`p-${i}`">
                    <td class="px-3 py-2">{{ t.sheet_size }}</td>
                    <td class="px-3 py-2">{{ t.color_mode }}</td>
                    <td class="px-3 py-2 text-right">KES {{ t.selling_price_per_side }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="pricingStore.defaultPapers.length" class="space-y-2">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Paper</h4>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
              <table class="min-w-full">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Size</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">GSM</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-500">Sell</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                  <tr v-for="(t, i) in pricingStore.defaultPapers" :key="`pa-${i}`">
                    <td class="px-3 py-2">{{ t.sheet_size }}</td>
                    <td class="px-3 py-2">{{ t.gsm }} gsm</td>
                    <td class="px-3 py-2">{{ t.paper_type }}</td>
                    <td class="px-3 py-2 text-right">KES {{ t.selling_price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="pricingStore.defaultMaterials.length" class="space-y-2">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Materials</h4>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
              <table class="min-w-full">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Material</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-500">Sell</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                  <tr v-for="(t, i) in pricingStore.defaultMaterials" :key="`m-${i}`">
                    <td class="px-3 py-2">{{ t.material_name }}</td>
                    <td class="px-3 py-2">{{ t.unit }}</td>
                    <td class="px-3 py-2 text-right">KES {{ t.selling_price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="pricingStore.defaultFinishing.length" class="space-y-2">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Finishing</h4>
            <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
              <table class="min-w-full">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-500">Sell</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                  <tr v-for="(t, i) in pricingStore.defaultFinishing" :key="`f-${i}`">
                    <td class="px-3 py-2">{{ t.name }}</td>
                    <td class="px-3 py-2">{{ t.category }}</td>
                    <td class="px-3 py-2 text-right">KES {{ t.selling_price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="!hasAnyDefaults" class="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No default templates available.
          </div>
        </template>
      </div>
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import type {
  PrintingPrice,
  PaperPrice,
  FinishingService,
  VolumeDiscount,
  PrintingPriceForm,
  PaperPriceForm,
  FinishingServiceForm,
  VolumeDiscountForm,
} from '~/shared/types'
import { usePricingStore } from '~/stores/pricing'
import { useMachineStore } from '~/stores/machine'
import { extractApiFeedback } from '~/utils/api-feedback'
import { safeLogError } from '~/utils/safeLog'

type TabId = 'printing' | 'paper' | 'finishing' | 'discounts'

const tabs = [
  { id: 'printing' as TabId, name: 'Printing' },
  { id: 'paper' as TabId, name: 'Paper' },
  { id: 'finishing' as TabId, name: 'Finishing' },
  { id: 'discounts' as TabId, name: 'Discounts' },
]

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const pricingStore = usePricingStore()
const machineStore = useMachineStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)
const activeTab = ref<TabId>('printing')
const loading = ref(true)

// Modals
const printingModalOpen = ref(false)
const paperModalOpen = ref(false)
const finishingModalOpen = ref(false)
const discountModalOpen = ref(false)
const printingFormReady = ref(false)
const paperFormReady = ref(false)
const finishingFormReady = ref(false)
const discountFormReady = ref(false)
const editingPrintingPrice = ref<PrintingPrice | null>(null)
const editingPaperPrice = ref<PaperPrice | null>(null)
const editingFinishingService = ref<FinishingService | null>(null)
const editingDiscount = ref<VolumeDiscount | null>(null)
const formLoading = ref(false)
const viewDefaultsOpen = ref(false)
const defaultsLoading = ref(false)
const seedLoading = ref(false)
const printingFeedback = useSubmissionFeedback()
const paperFeedback = useSubmissionFeedback()
const finishingFeedback = useSubmissionFeedback()
const discountFeedback = useSubmissionFeedback()

const machineOptions = computed(() => machineStore.machineOptions)

const hasAnyDefaults = computed(
  () =>
    pricingStore.defaultPrinting.length > 0 ||
    pricingStore.defaultPapers.length > 0 ||
    pricingStore.defaultMaterials.length > 0 ||
    pricingStore.defaultFinishing.length > 0
)

async function openViewDefaults() {
  viewDefaultsOpen.value = true
  defaultsLoading.value = true
  try {
    await pricingStore.fetchPricingDefaults()
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to load defaults', color: 'error' })
  } finally {
    defaultsLoading.value = false
  }
}

async function loadStarterDefaults() {
  seedLoading.value = true
  pricingStore.error = null
  try {
    await pricingStore.seedShopDefaults(slug.value)
    toast.add({ title: 'Loaded', description: 'Starter defaults have been added to your shop.' })
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to seed defaults', color: 'error' })
  } finally {
    seedLoading.value = false
  }
}

function remapFieldErrors(
  errors: Record<string, string>,
  fieldMap: Record<string, string>
) {
  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [fieldMap[key] ?? key, value])
  )
}

function apiFeedback(
  err: unknown,
  fallback: string,
  fieldMap: Record<string, string> = {}
) {
  const parsed = extractApiFeedback(err, fallback)
  return {
    message: parsed.message,
    fieldErrors: remapFieldErrors(parsed.fieldErrors, fieldMap),
  }
}

const openPrintingModal = (price?: PrintingPrice) => {
  printingFeedback.reset()
  editingPrintingPrice.value = price ?? null
  printingModalOpen.value = true
}
const editPrintingPrice = (price: PrintingPrice) => openPrintingModal(price)
const closePrintingModal = () => {
  printingModalOpen.value = false
  printingFeedback.reset()
  editingPrintingPrice.value = null
}
watch(printingModalOpen, (open) => {
  if (open) {
    printingFormReady.value = false
    nextTick(() => { printingFormReady.value = true })
  } else {
    printingFormReady.value = false
    printingFeedback.reset()
    editingPrintingPrice.value = null
  }
}, { immediate: true })
async function submitPrintingPrice(data: PrintingPriceForm) {
  const existing = editingPrintingPrice.value
  formLoading.value = true
  printingFeedback.reset()
  try {
    if (existing) {
      await pricingStore.updatePrintingPrice(slug.value, existing.id, {
        selling_price_per_side: data.selling_price_per_side,
        selling_price_duplex_per_sheet: data.selling_price_duplex_per_sheet,
      })
      printingFeedback.setSuccess('Printing price saved successfully.')
      closePrintingModal()
      await refreshPrinting()
    } else {
      await pricingStore.createPrintingPrice(slug.value, {
        machine: data.machine,
        sheet_size: data.sheet_size,
        color_mode: data.color_mode,
        selling_price_per_side: data.selling_price_per_side,
        selling_price_duplex_per_sheet: data.selling_price_duplex_per_sheet ?? undefined,
      })
      printingFeedback.setSuccess('Printing price saved successfully.')
      closePrintingModal()
      await refreshPrinting()
    }
  } catch (err: unknown) {
    const parsed = apiFeedback(err, 'We could not save this printing price right now.', {
      single_price: 'selling_price_per_side',
      double_price: 'selling_price_duplex_per_sheet',
    })
    printingFeedback.setError(parsed.message, 'Save failed', false, parsed.fieldErrors)
  } finally {
    formLoading.value = false
  }
}

async function deletePrintingPrice(id: number) {
  try {
    await pricingStore.deletePrintingPrice(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Printing price removed' })
    refreshPrinting()
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete', color: 'error' })
  }
}

// Paper modal
const openPaperModal = (price?: PaperPrice) => {
  paperFeedback.reset()
  editingPaperPrice.value = price ?? null
  paperModalOpen.value = true
}
const editPaperPrice = (price: PaperPrice) => openPaperModal(price)
const closePaperModal = () => {
  paperModalOpen.value = false
  paperFeedback.reset()
  editingPaperPrice.value = null
}
watch(paperModalOpen, (open) => {
  if (open) {
    paperFormReady.value = false
    nextTick(() => { paperFormReady.value = true })
  } else {
    paperFormReady.value = false
    paperFeedback.reset()
    editingPaperPrice.value = null
  }
}, { immediate: true })
async function submitPaperPrice(data: PaperPriceForm) {
  formLoading.value = true
  paperFeedback.reset()
  try {
    if (editingPaperPrice.value) {
      await pricingStore.updatePaperPrice(slug.value, editingPaperPrice.value.id, data)
      paperFeedback.setSuccess('Paper price saved successfully.')
    } else {
      await pricingStore.createPaperPrice(slug.value, data)
      paperFeedback.setSuccess('Paper price saved successfully.')
    }
    closePaperModal()
    await pricingStore.fetchPaperPrices(slug.value)
  } catch (err: unknown) {
    const parsed = apiFeedback(err, 'We could not save this paper price right now.')
    paperFeedback.setError(parsed.message, 'Save failed', false, parsed.fieldErrors)
  } finally {
    formLoading.value = false
  }
}
async function deletePaperPrice(id: number) {
  try {
    await pricingStore.deletePaperPrice(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Paper price removed' })
    await pricingStore.fetchPaperPrices(slug.value)
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete', color: 'error' })
  }
}

// Finishing modal
const openFinishingModal = (service?: FinishingService) => {
  finishingFeedback.reset()
  editingFinishingService.value = service ?? null
  finishingModalOpen.value = true
}
const editFinishingService = (service: FinishingService) => openFinishingModal(service)
const closeFinishingModal = () => {
  finishingModalOpen.value = false
  finishingFeedback.reset()
  editingFinishingService.value = null
}
watch(finishingModalOpen, (open) => {
  if (open) {
    finishingFormReady.value = false
    nextTick(() => { finishingFormReady.value = true })
  } else {
    finishingFormReady.value = false
    finishingFeedback.reset()
    editingFinishingService.value = null
  }
}, { immediate: true })
async function submitFinishingService(data: FinishingServiceForm) {
  formLoading.value = true
  finishingFeedback.reset()
  try {
    if (editingFinishingService.value) {
      await pricingStore.updateFinishingService(slug.value, editingFinishingService.value.id, data)
      finishingFeedback.setSuccess('Finishing service saved successfully.')
    } else {
      await pricingStore.createFinishingService(slug.value, data)
      finishingFeedback.setSuccess('Finishing service saved successfully.')
    }
    closeFinishingModal()
    await pricingStore.fetchFinishingServices(slug.value)
  } catch (err: unknown) {
    const parsed = apiFeedback(err, 'We could not save this finishing service right now.', {
      charge_unit: 'charge_by',
      price: 'selling_price',
    })
    finishingFeedback.setError(parsed.message, 'Save failed', false, parsed.fieldErrors)
  } finally {
    formLoading.value = false
  }
}
async function deleteFinishingService(id: number) {
  try {
    await pricingStore.deleteFinishingService(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Finishing service removed' })
    await pricingStore.fetchFinishingServices(slug.value)
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete', color: 'error' })
  }
}

// Discount modal
const openDiscountModal = (discount?: VolumeDiscount) => {
  discountFeedback.reset()
  editingDiscount.value = discount ?? null
  discountModalOpen.value = true
}
const editDiscount = (discount: VolumeDiscount) => openDiscountModal(discount)
const closeDiscountModal = () => {
  discountModalOpen.value = false
  discountFeedback.reset()
  editingDiscount.value = null
}
watch(discountModalOpen, (open) => {
  if (open) {
    discountFormReady.value = false
    nextTick(() => { discountFormReady.value = true })
  } else {
    discountFormReady.value = false
    discountFeedback.reset()
    editingDiscount.value = null
  }
}, { immediate: true })
async function submitVolumeDiscount(data: VolumeDiscountForm) {
  formLoading.value = true
  discountFeedback.reset()
  try {
    if (editingDiscount.value) {
      await pricingStore.updateVolumeDiscount(slug.value, editingDiscount.value.id, data)
      discountFeedback.setSuccess('Volume discount saved successfully.')
    } else {
      await pricingStore.createVolumeDiscount(slug.value, data)
      discountFeedback.setSuccess('Volume discount saved successfully.')
    }
    closeDiscountModal()
    await pricingStore.fetchVolumeDiscounts(slug.value)
  } catch (err: unknown) {
    const parsed = apiFeedback(err, 'We could not save this volume discount right now.')
    discountFeedback.setError(parsed.message, 'Save failed', false, parsed.fieldErrors)
  } finally {
    formLoading.value = false
  }
}
async function deleteDiscount(id: number) {
  try {
    await pricingStore.deleteVolumeDiscount(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Volume discount removed' })
    await pricingStore.fetchVolumeDiscounts(slug.value)
  } catch (err: unknown) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete', color: 'error' })
  }
}

async function refreshPrinting() {
  await pricingStore.fetchPrintingPrices(slug.value)
}

onMounted(async () => {
  pricingStore.error = null
  try {
    await Promise.all([
      pricingStore.fetchPrintingPrices(slug.value),
      pricingStore.fetchPaperPrices(slug.value),
      pricingStore.fetchMaterialPrices(slug.value),
      pricingStore.fetchFinishingServices(slug.value),
      pricingStore.fetchVolumeDiscounts(slug.value),
      machineStore.fetchMachines(slug.value),
    ])
  } catch (err) {
    safeLogError(err, 'pricing.fetch')
  } finally {
    loading.value = false
  }
})
</script>
