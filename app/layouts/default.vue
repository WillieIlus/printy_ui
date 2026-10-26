<template>
  <div class="role-canvas grain min-h-screen" :style="themeCss">
    <div
      v-if="!authed"
      class="mat-grid pointer-events-none fixed inset-0 opacity-[0.55]"
      style="--line: rgba(27, 23, 16, 0.05)"
    />

    <!-- ── header ── -->
    <header
      v-if="!isAppAuth"
      class="sticky top-0 z-40 border-b backdrop-blur-xl"
      :style="{
        borderColor: 'var(--line)',
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
      }"
    >
      <div class="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 sm:px-6">
        <NuxtLink :to="homeLink" class="flex shrink-0 items-center gap-2.5 text-left">
          <Mark />
          <span class="leading-none">
            <span class="font-disp block text-[18px] font-bold tracking-tight">printy</span>
            <span class="font-mono2 block text-[7.5px] uppercase tracking-[0.3em] text-[var(--sub)]">print · production · custody</span>
          </span>
        </NuxtLink>

        <!-- dashboard call chip -->
        <span
          v-if="isDash && authed"
          class="ml-3 hidden rounded-full px-2.5 py-1 font-mono2 text-[9px] font-semibold uppercase tracking-[0.24em] md:inline-block"
          style="background: var(--panel2); color: var(--accent)"
        >
          {{ meta.call }}
        </span>

        <!-- signed-in account chip -->
        <div class="ml-auto flex items-center gap-2">
          <span
            v-if="isDash && authed"
            class="hidden items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)] xl:flex"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full" style="background: #2fbf71" />
            {{ liveNow }}
          </span>

          <button
            v-if="showBuyerEntries"
            type="button"
            class="press-key hidden items-center gap-1.5 rounded-full border px-3 py-2 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-colors sm:inline-flex"
            style="border-color: var(--line); color: var(--sub)"
            @click="goQuote"
          >
            <Calculator :size="13" /> Quote
          </button>

          <template v-if="authed">
            <NuxtLink
              :to="dashPath"
              class="press-key hidden items-center gap-1.5 rounded-full px-3.5 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.14em] sm:inline-flex"
              style="background: var(--accent); color: var(--accentInk)"
            >
              <LayoutDashboard :size="13" /> Dashboard
            </NuxtLink>

            <div
              class="hidden items-center rounded-full border py-1 pl-1 pr-3 lg:flex"
              style="border-color: var(--line); background: var(--panel)"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full font-mono2 text-[10px] font-bold"
                style="background: var(--accent); color: var(--accentInk)"
              >
                {{ initials }}
              </span>
              <span class="ml-2 text-left leading-tight">
                <span class="font-disp block text-[11.5px] font-semibold">{{ userName }}</span>
                <span class="font-mono2 block text-[8px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ meta.label }}</span>
              </span>
            </div>

            <NuxtLink
              :to="'/auth/change-password'"
              title="Change password"
              class="press-key hidden rounded-full border p-2 lg:block"
              style="border-color: var(--line); color: var(--sub)"
            >
              <KeyRound :size="13" />
            </NuxtLink>
            <NuxtLink
              :to="'/app/settings'"
              title="Account settings"
              class="press-key hidden rounded-full border p-2 lg:block"
              style="border-color: var(--line); color: var(--sub)"
            >
              <Settings :size="13" />
            </NuxtLink>
            <NotificationBell />
            <button
              type="button"
              title="Sign out"
              class="press-key rounded-full border p-2 transition-colors hover:text-[#fb4d6d]"
              style="border-color: var(--line); color: var(--sub)"
              @click="signOut"
            >
              <LogOut :size="13" />
            </button>
          </template>

          <template v-else>
            <NuxtLink
              to="/sign-in"
              class="press-key hidden rounded-full px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:block"
              style="color: var(--sub)"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              to="/sign-up"
              class="press-key rounded-full px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em]"
              style="background: var(--accent); color: var(--accentInk)"
            >
              Get started
            </NuxtLink>
          </template>

          <button
            type="button"
            class="press-key rounded-full border p-2 lg:hidden"
            style="border-color: var(--line); color: var(--sub)"
            @click="menu = !menu"
          >
            <X v-if="menu" :size="14" />
            <Menu v-else :size="14" />
          </button>
        </div>
      </div>

      <!-- mobile menu -->
      <nav
        v-if="menu"
        class="overflow-hidden border-t lg:hidden"
        style="border-color: var(--line); background: var(--panel)"
      >
        <div class="flex flex-col p-3">
          <NuxtLink
            v-if="authed"
            :to="dashPath"
                    class="mt-1 rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
                    style="color: var(--accent)"
                    @click="menu = false"
                  >
                    My dashboard
                  </NuxtLink>
                  <NuxtLink
                    v-if="authed"
                    to="/auth/change-password"
                    class="rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
                    @click="menu = false"
                  >
                    Change password
                  </NuxtLink>
                  <NuxtLink
                    v-if="authed"
                    to="/app/settings"
                    class="rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
                    @click="menu = false"
                  >
                    Account settings
                  </NuxtLink>
          <NuxtLink
            v-else
            to="/sign-in"
            class="mt-1 rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
            style="color: var(--accent)"
            @click="menu = false"
          >
            Sign in
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- portal app shells: dedicated client & partner dashboard frames -->
    <ClientShell v-if="isBuyerApp" variant="client">
      <slot />
    </ClientShell>
    <ClientShell v-else-if="isManagerApp" variant="partner">
      <slot />
    </ClientShell>
    <ClientShell v-else-if="isPrinterApp" variant="shop">
      <slot />
    </ClientShell>

    <!-- app shell for authenticated /app/* non-admin routes -->
    <div v-else-if="isAppAuth" class="relative">
      <!-- sticky top bar (only on app routes) -->
      <div
        class="sticky top-0 z-50 border-b backdrop-blur-xl"
        :style="{
          borderColor: 'var(--line)',
          background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        }"
      >
        <div class="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-2 sm:px-6">
          <!-- hamburger button (mobile only) -->
          <button
            type="button"
            class="pr-2 lg:hidden press-key flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[9px] uppercase tracking-[0.14em]"
            style="color: var(--sub)"
            @click="mobileMenu = !mobileMenu"
          >
            <Menu :size="16" /> Menu
          </button>

          <!-- TrackJobPrompt: single shared instance -->
          <TrackJobPrompt />

          <!-- notification bell -->
          <NotificationBell class="hidden sm:inline-block" />

          <!-- user chip with dropdown -->
          <div class="ml-auto flex items-center gap-2">
            <template v-if="authed">
              <div
                class="hidden items-center rounded-full border py-1 pl-1 pr-3 lg:flex"
                style="border-color: var(--line); background: var(--panel)"
              >
                <span
                  class="flex h-7 w-7 items-center justify-center rounded-full font-mono2 text-[10px] font-bold"
                  style="background: var(--accent); color: var(--accentInk)"
                >
                  {{ initials }}
                </span>
                <span class="ml-2 text-left leading-tight">
                  <span class="font-disp block text-[11.5px] font-semibold">{{ userName }}</span>
                  <span class="font-mono2 block text-[8px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ meta.label }}</span>
                </span>
              </div>

              <NuxtLink
                :to="'/auth/change-password'"
                title="Change password"
                class="press-key hidden rounded-full border p-2 lg:block"
                style="border-color: var(--line); color: var(--sub)"
              >
                <KeyRound :size="13" />
              </NuxtLink>
              <NuxtLink
                :to="'/app/settings'"
                title="Account settings"
                class="press-key hidden rounded-full border p-2 lg:block"
                style="border-color: var(--line); color: var(--sub)"
              >
                <Settings :size="13" />
              </NuxtLink>

              <button
                type="button"
                title="Sign out"
                class="press-key rounded-full border p-2 transition-colors hover:text-[#fb4d6d]"
                style="border-color: var(--line); color: var(--sub)"
                @click="signOut"
              >
                <LogOut :size="13" />
              </button>
            </template>

            <template v-else>
              <NuxtLink
                to="/sign-in"
                class="press-key hidden rounded-full px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:block"
                style="color: var(--sub)"
              >
                Sign in
              </NuxtLink>
              <NuxtLink
                to="/sign-up"
                class="press-key rounded-full px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em]"
                style="background: var(--accent); color: var(--accentInk)"
              >
                Get started
              </NuxtLink>
            </template>
          </div>

          <!-- buyer-only [Quote] button (signed-in managers/printers hidden) -->
          <button
            v-if="showBuyerEntries"
            type="button"
            class="pr-2 hidden sm:inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
            style="background: var(--accent)"
            @click="goQuote"
          >
            <Calculator :size="13" /> Quote
          </button>
        </div>
      </div>

      <!-- mobile overlay menu -->
      <nav
        v-if="mobileMenu"
        class="fixed inset-0 z-40 overflow-y-auto"
        style="border-color: var(--line); background: var(--panel)"
      >
        <div class="flex flex-col p-8" @click.stop>
          <NuxtLink
            v-if="authed"
            :to="dashPath"
                    class="mt-1 rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
                    style="color: var(--accent)"
                    @click="mobileMenu = false"
          >
            My dashboard
          </NuxtLink>
          <NuxtLink
            v-if="authed"
            to="/auth/change-password"
            class="rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
            @click="mobileMenu = false"
          >
            Change password
          </NuxtLink>
          <NuxtLink
            v-if="authed"
            to="/app/settings"
            class="rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
            @click="mobileMenu = false"
          >
            Account settings
          </NuxtLink>
          <NuxtLink
            v-else
            to="/sign-in"
            class="mt-1 rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
            style="color: var(--accent)"
            @click="mobileMenu = false"
          >
            Sign in
          </NuxtLink>
        </div>
      </nav>

      <!-- fixed full-height side nav rail (excl. admin) -->
      <aside
        v-if="showNav"
        class="fixed left-0 top-0 bottom-0 w-16 z-20 flex flex-col border-r backdrop-blur-xl"
        :style="{ borderColor: 'var(--line)' }"
      >
        <div class="flex flex-col items-center py-3">
          <NuxtLink
            :to="dashPath"
            class="flex flex-col items-center mb-8"
            style="color: var(--accent)"
          >
            <Mark :size="24" />
            <span class="text-xs font-mono2 uppercase tracking-[0.3em]">printy</span>
          </NuxtLink>

          <SideNav />
        </div>
      </aside>

      <!-- page content column -->
      <main class="relative flex-1 ml-16 overflow-auto">
        <AppBreadcrumbs class="mb-2" />
        <slot />
      </main>

      <!-- ticker (signed in, on dashboards) -->
      <Ticker v-if="authed && isDash" />
    </div>
    <!-- page outlet for marketing, auth, track, and admin (admin renders its own shell) -->
    <main v-else class="relative flex-1">
      <slot />
    </main>

    <!-- ── footer ── -->
    <footer v-if="!isBuyerApp && !isManagerApp && !isPrinterApp && route.path !== '/'" class="relative border-t" style="border-color: var(--line); background: var(--panel)">
      <div class="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div class="flex items-center gap-2.5">
            <Mark :size="22" />
            <span class="font-disp text-[16px] font-bold tracking-tight">printy</span>
          </div>
          <p class="mt-3 max-w-[34ch] text-[12.5px] leading-relaxed text-[var(--sub)]">
            One job. One workflow. Every view. Exact print pricing and full production visibility for Kenyan businesses.
          </p>
          <div class="mt-4 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--accent)]">printy.ke</div>
        </div>
        <div v-for="col in footerCols" :key="col.t">
          <div class="font-mono2 text-[9px] uppercase tracking-[0.2em] text-[var(--sub)]">{{ col.t }}</div>
          <ul class="mt-3 space-y-2">
            <li v-for="[label, to] in col.links" :key="label">
              <NuxtLink :to="to" class="text-[12.5px] text-[var(--sub)] transition-colors hover:text-[var(--accent)]">{{ label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t" style="border-color: var(--line)">
        <div class="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-2 px-4 py-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--sub)] sm:px-6">
          <span>one job — one workflow — different views</span>
          <span>© {{ year }} printy · nairobi</span>
        </div>
      </div>
    </footer>

    <!-- command center (layout-owned) -->
    <JobCommandCenter v-if="authed" />

    <!-- toasts -->
    <Toasts />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Calculator, KeyRound, LayoutDashboard, LogOut, Menu, Settings,
  X,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useWorkflowStore } from '~/stores/workflow'
import { useProtoTheme } from '~/composables/useProtoTheme'
import { protoHomeRoute, protoRoleFor } from '~/shared/workspace'
import { quoteNavTarget } from '~/shared/quote-target'

const route = useRoute()
const auth = useAuthStore()
const w = useWorkflowStore()
const { protoRole, meta, themeVars } = useProtoTheme()

const menu = ref(false)
const mobileMenu = ref(false)
const isAppAuth = computed(() => authed.value && isDash.value && protoRole.value !== 'admin')
const showNav = computed(() => protoRole.value !== 'admin')
const year = new Date().getFullYear()

const authed = computed(() => auth.isAuthenticated)
const isDash = computed(() => route.path.startsWith('/app'))
const isBuyer = computed(() => authed.value && protoRole.value === 'buyer')
const isBuyerApp = computed(() => isAppAuth.value && isBuyer.value)
const isManagerApp = computed(() => isAppAuth.value && protoRole.value === 'manager')
const isPrinterApp = computed(() => isAppAuth.value && protoRole.value === 'printer')
// Law 9.1 — buyer entry points (home / instant quote) are hidden from a
// signed-in manager or printer; signed-out visitors and buyers still see them.
const showBuyerEntries = computed(() => !authed.value || isBuyer.value)
const userName = computed(() => auth.user?.name || 'Printy user')
const initials = computed(() =>
  userName.value.split(' ').map(wrd => wrd[0]).slice(0, 2).join('').toUpperCase(),
)
const dashPath = computed(() => protoHomeRoute(protoRole.value))
// Law 9.1 — the brand mark is a home link; send a signed-in manager/printer to
// their own dashboard instead of the buyer-only homepage.
const homeLink = computed(() => (showBuyerEntries.value ? '/' : dashPath.value))

const footerCols = computed(() => {
  const product: Array<[string, string]> = [
    ['How it works', '/how-it-works'],
    ['Track a job', '/track'],
  ]
  const company: Array<[string, string]> = [
    ['About', '/about'],
    ['Contact', '/contact'],
    ['For printers', '/sign-up?mode=printer'],
    ['For managers', '/sign-up?mode=manager'],
  ]
  const legal: Array<[string, string]> = [
    ['Terms', '/legal'],
    ['Privacy', '/legal'],
  ]
  if (showBuyerEntries.value) {
    product.push(['Get a quote', '/'])
    legal.push(['Sign in', '/sign-in'], ['Create account', '/sign-up'])
  }
  return [
    { t: 'Product', links: product },
    { t: 'Company', links: company },
    { t: 'Legal', links: legal },
  ]
})

const themeCss = computed(() => ({ ...themeVars.value, background: 'var(--bg)', color: 'var(--ink)' }))

watch(
  () => auth.dashboardRole,
  (d) => {
    if (auth.isAuthenticated) {
      w.setRole(protoRoleFor(d))
    }
  },
  { immediate: true },
)

watch(
  () => route.path,
  () => {
    menu.value = false
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  },
)

async function signOut() {
  w.setRole('buyer')
  await auth.logout()
}
function goQuote() {
  // Law 9.1 — a signed-in manager/printer never lands on the buyer homepage.
  if (authed.value && !isBuyer.value) {
    return navigateTo(dashPath.value)
  }
  if (isBuyer.value) {
    w.buyerQuoteOpen = true
  }
  return navigateTo(quoteNavTarget(authed.value, protoRole.value))
}

const liveNow = ref('')
let clockInterval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  liveNow.value = formatLiveNow()
  clockInterval = setInterval(() => {
    liveNow.value = formatLiveNow()
  }, 30000)
})
onUnmounted(() => {
  if (clockInterval !== null) {
    clearInterval(clockInterval)
  }
})
function formatLiveNow(): string {
  const d = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} - ${hh}:${mm}`
}
</script>

<script lang="ts">
export default {
  name: 'DefaultLayout',
}
</script>