<template>
  <!-- B1.3 — public proof, no commerce: photo, first name, one speciality line and
       the Verified badge. No prices, ratings, ranking or filters, and the whole
       strip disappears when the server has nothing to show (it returns an empty
       list below three qualifying managers). -->
  <section v-if="managers.length" id="verified-managers" class="mx-auto w-full max-w-[1180px] px-4 pt-14">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
          <BadgeCheck :size="12" style="color: var(--accent)" aria-hidden="true" /> verified by printy
        </div>
        <h2 class="mt-2 font-disp text-[26px] font-bold tracking-tight sm:text-[32px]">Verified managers</h2>
        <p class="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
          Real people who have been checked by Printy. Pick one and we will price your job from the live network.
        </p>
      </div>
      <button
        type="button"
        data-test="verified-managers-cta"
        class="press-key inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-mono2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-white"
        style="background: var(--accent)"
        @click="requestQuote"
      >
        Request a quote <ArrowRight :size="15" aria-hidden="true" />
      </button>
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="(manager, index) in managers"
        :key="`${manager.first_name}-${index}`"
        data-test="verified-manager-card"
        class="flex items-start gap-3 rounded-2xl border p-4"
        style="border-color: var(--line); background: var(--panel)"
      >
        <div class="h-12 w-12 shrink-0 overflow-hidden rounded-full" style="box-shadow: inset 0 0 0 1px var(--line)">
          <img
            v-if="manager.photo"
            :src="manager.photo"
            :alt="`Photo of ${manager.first_name}`"
            class="h-full w-full object-cover"
            loading="lazy"
          >
          <span
            v-else
            class="flex h-full w-full items-center justify-center font-mono2 text-[13px] font-bold"
            style="background: var(--panel2); color: var(--sub)"
          >{{ manager.first_name.slice(0, 1).toUpperCase() }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="truncate font-disp text-[14px] font-bold tracking-tight">{{ manager.first_name }}</div>
          <p class="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-[var(--sub)]">{{ manager.speciality }}</p>
          <span
            v-if="manager.verified"
            data-test="verified-manager-badge"
            class="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-[2px] font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em]"
            style="border-color: var(--accent); color: var(--accent)"
          >
            <BadgeCheck :size="9" aria-hidden="true" /> Verified
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight, BadgeCheck } from 'lucide-vue-next'
import { API } from '~/shared/api-paths'
import type { FeaturedManager, FeaturedManagersResponse } from '~/shared/types'
import { saveVerifiedManagersChoice } from '~/shared/verified-managers'

const { publicApiNoAuth } = useApi()

const managers = ref<FeaturedManager[]>([])

onMounted(async () => {
  try {
    const payload = await publicApiNoAuth<FeaturedManagersResponse>(API.intake.publicFeaturedManagers)
    managers.value = Array.isArray(payload?.results) ? payload.results : []
  } catch {
    // Marketing must never break on a failed fetch: the strip just stays hidden.
    managers.value = []
  }
})

function requestQuote() {
  // Signed-out visitors: remember the choice so it survives the quote flow and a
  // later sign-up. The quote page reads and clears it.
  saveVerifiedManagersChoice()
  return navigateTo('/quote')
}
</script>
