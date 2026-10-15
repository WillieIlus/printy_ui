<template>
  <form
    class="flex items-center gap-2 rounded-2xl border p-1.5 pl-3.5 transition-colors focus-within:border-[var(--accent)]"
    :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
    @submit.prevent="go"
  >
    <PackageSearch :size="15" style="color: var(--sub)" class="shrink-0" />
    <input
      v-model="code"
      placeholder="Track a job number — e.g. PTY-1041"
      class="w-full bg-transparent py-2 font-mono2 text-[12.5px] uppercase tracking-[0.08em] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--sub)] placeholder:opacity-60"
    />
    <button
      type="submit"
      :disabled="!code.trim()"
      class="press-key shrink-0 rounded-xl px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
      style="background: var(--accent)"
    >
      Track
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PackageSearch } from 'lucide-vue-next'

const code = ref('')

function go() {
  const token = code.value.trim()
  if (!token) return
  void navigateTo({ path: '/track', query: { token } })
}
</script>
