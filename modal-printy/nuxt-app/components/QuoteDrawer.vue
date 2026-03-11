<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />

        <!-- Drawer panel -->
        <div
          class="drawer-panel relative ml-auto w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col h-full"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700">
            <div class="flex items-center gap-2">
              <ShoppingCartIcon class="h-5 w-5 text-amber-500" />
              <h2 class="text-lg font-bold text-stone-800 dark:text-stone-100">
                Quote Draft ({{ quoteStore.itemCount }})
              </h2>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="quoteStore.itemCount > 0"
                @click="quoteStore.clearQuote()"
                class="text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
              <button
                @click="close"
                class="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Items -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-if="quoteStore.itemCount === 0"
              class="flex flex-col items-center justify-center h-full text-stone-400 dark:text-stone-500 px-6"
            >
              <ShoppingCartIcon class="h-16 w-16 mb-4" />
              <p class="text-lg font-medium">Your quote is empty</p>
              <p class="text-sm mt-1">Click "Tweak" on any product to customize and add it.</p>
            </div>

            <div v-else class="divide-y divide-stone-100 dark:divide-stone-800">
              <div
                v-for="item in quoteStore.items"
                :key="item.id"
                class="px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div class="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                    <PackageIcon class="h-6 w-6 text-stone-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-stone-800 dark:text-stone-100 text-sm truncate">
                      {{ item.product.name }}
                    </p>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {{ item.quantity }} pcs •
                      {{ item.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided' }} •
                      {{ item.color_mode === 'BW' ? 'B&W' : 'Color' }}
                    </p>
                    <p v-if="item.paper" class="text-xs text-stone-400 mt-0.5">
                      📄 {{ item.paper.sheet_size }} {{ item.paper.gsm }}gsm {{ item.paper.paper_type }}
                    </p>
                    <p v-if="item.material" class="text-xs text-stone-400 mt-0.5">
                      🧱 {{ item.material.material_type ?? item.material.name }}
                    </p>
                    <p v-if="item.finishings.length" class="text-xs text-stone-400 mt-0.5">
                      ✨ {{ item.finishings.map(f => f.name).join(', ') }}
                    </p>
                    <p v-if="item.special_instructions" class="text-xs text-amber-600 dark:text-amber-400 mt-0.5 italic">
                      "{{ item.special_instructions }}"
                    </p>
                  </div>
                  <button
                    @click="quoteStore.removeItem(item.id)"
                    class="p-1.5 text-stone-300 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2Icon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            v-if="quoteStore.itemCount > 0"
            class="border-t border-stone-200 dark:border-stone-700 px-6 py-4 space-y-3"
          >
            <div class="flex justify-between text-sm">
              <span class="text-stone-500 dark:text-stone-400">Total items</span>
              <span class="font-semibold text-stone-800 dark:text-stone-100">{{ quoteStore.itemCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-stone-500 dark:text-stone-400">Total quantity</span>
              <span class="font-semibold text-stone-800 dark:text-stone-100">
                {{ quoteStore.totalQuantity.toLocaleString() }} pcs
              </span>
            </div>
            <button class="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
              <SendIcon class="h-4 w-4" />
              Submit Quote Request
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  X as XIcon,
  ShoppingCart as ShoppingCartIcon,
  Package as PackageIcon,
  Trash2 as Trash2Icon,
  Send as SendIcon,
} from 'lucide-vue-next'
import { useQuoteStore } from '~/stores/quote'

const modelValue = defineModel<boolean>({ default: false })
const quoteStore = useQuoteStore()

function close() {
  modelValue.value = false
}

watch(modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
