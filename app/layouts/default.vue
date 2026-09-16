<template>
  <div class="role-canvas grain min-h-screen" :style="themeCss">
    <div
      v-if="!authed"
      class="mat-grid pointer-events-none fixed inset-0 opacity-[0.55]"
      style="--line: rgba(27, 23, 16, 0.05)"
    />

    <!-- ── header ── -->
    <header
      class="sticky top-0 z-40 border-b backdrop-blur-xl"
      :style="{
        borderColor: 'var(--line)',
        background: theme.dark
          ? 'color-mix(in srgb, var(--bg) 82%, transparent)'
          : 'color-mix(in srgb, var(--bg) 88%, transparent)',
      }"
    >
      <div class="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 sm:px-6">
        <NuxtLink to="/" class="flex shrink-0 items-center gap-2.5 text-left">
          <Mark />
          <span class="leading-none">
            <span class="font-disp block text-[18px] font-bold tracking-tight">printy</span>
            <span class="font-mono2 block text-[7.5px] uppercase tracking-[0.3em] text-[var(--sub)]">print · production · custody</span>
          </span>
        </NuxtLink>

        <!-- desktop nav -->
        <nav v-if="!isDash" class="ml-6 hidden items-center gap-1 lg:flex">
          <NuxtLink
            v-for="n in PUBLIC_NAV"
            :key="n.to"
            :to="n.to"
            class="rounded-full px-3 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
            :style="{
              color: navActive(n.to) ? 'var(--accent)' : 'var(--sub)',
              background: navActive(n.to) ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
            }"
          >
            {{ n.label }}
          </NuxtLink>
        </nav>

        <!-- dashboard call chip -->
        <span
          v-if="isDash && authed"
          class="ml-3 hidden rounded-full px-2.5 py-1 font-mono2 text-[9px] font-semibold uppercase tracking-[0.24em] md:inline-block"
          style="background: var(--panel2); color: var(--accent)"
        >
          {{ meta.call }}
        </span>

        <!-- role switcher (signed in only, when multiple roles are accessible) -->
        <nav
          v-if="authed && switcherRoles.length > 1"
          class="mx-auto hidden items-center gap-1 rounded-full border p-1 md:flex"
          style="border-color: var(--line); background: var(--panel)"
        >
          <button
            v-for="r in switcherRoles"
            :key="r"
            type="button"
            :class="'relative flex items-center gap-1.5 rounded-full px-3 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors sm:px-3.5'"
            :style="{ color: protoRole === r ? 'var(--accentInk)' : 'var(--sub)' }"
            @click="switchRole(r)"
          >
            <span
              v-if="protoRole === r"
              class="absolute inset-0 rounded-full"
              :style="{ background: roleAccent(r) }"
            />
            <component :is="roleIcon(r)" :size="13" class="relative shrink-0" />
            <span class="relative hidden md:inline">{{ roleLabel(r) }}</span>
          </button>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <span
            v-if="isDash && authed"
            class="hidden items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)] xl:flex"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full" style="background: #2fbf71" />
            {{ liveNow }}
          </span>

          <button
            type="button"
            class="press-key hidden items-center gap-1.5 rounded-full border px-3 py-2 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-colors sm:inline-flex"
            style="border-color: var(--line); color: var(--sub)"
            @click="goQuote"
          >
            <Calculator :size="13" /> Quote
          </button>

          <NuxtLink
            :to="'/track'"
            class="press-key inline-flex items-center gap-1.5 rounded-full border px-3 py-2 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-colors"
            :style="{ borderColor: isTrack ? 'var(--accent)' : 'var(--line)', color: isTrack ? 'var(--accent)' : 'var(--sub)' }"
          >
            <PackageSearch :size="13" />
            <span class="hidden sm:inline">Track</span>
          </NuxtLink>

          <template v-if="authed">
            <NuxtLink
              :to="dashPath"
              class="press-key hidden items-center gap-1.5 rounded-full px-3.5 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.14em] sm:inline-flex"
              style="background: var(--accent); color: var(--accentInk)"
            >
              <LayoutDashboard :size="13" /> Dashboard
            </NuxtLink>

            <div
              v-if="switcherRoles.length <= 1"
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
            <div
              v-else
              class="hidden items-center gap-2 rounded-full border py-1 pl-1 pr-3 sm:flex"
              style="border-color: var(--line); background: var(--panel)"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full font-mono2 text-[10px] font-bold"
                style="background: var(--accent); color: var(--accentInk)"
              >
                {{ initials }}
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
            <button
              v-if="isDash"
              type="button"
              title="Reset demo"
              class="press-key hidden rounded-full border p-2 lg:block"
              style="border-color: var(--line); color: var(--sub)"
              @click="resetDemo"
            >
              <RotateCcw :size="13" />
            </button>
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
            v-for="n in PUBLIC_NAV"
            :key="n.to"
            :to="n.to"
            class="rounded-xl px-3 py-3 font-disp text-[14px] font-semibold"
            @click="menu = false"
          >
            {{ n.label }}
          </NuxtLink>
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

    <!-- ── ticker (signed in, on dashboards) ── -->
    <Ticker v-if="authed && isDash" />

    <!-- ── page ── -->
    <main class="relative flex-1">
      <slot />
    </main>

    <!-- ── footer ── -->
    <footer class="relative border-t" style="border-color: var(--line); background: var(--panel)">
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
          <span>one job → one workflow → different views</span>
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
import { computed, onUnmounted, ref } from 'vue'
import {
  Calculator, Gauge, KeyRound, LayoutDashboard, LogOut, Menu,
  PackageSearch, Printer as PrinterIcon, Radar, RotateCcw, ShoppingBag, X,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useWorkflowStore } from '~/stores/workflow'
import { useProtoTheme } from '~/composables/useProtoTheme'
import { dashboardForProto, protoHomeRoute, protoRoleFor } from '~/shared/workspace'
import { quoteNavTarget } from '~/shared/quote-target'
import type { Role } from '~/shared/workflow/printy'
import { ROLE_META } from '~/shared/workflow/printy'

const route = useRoute()
const auth = useAuthStore()
const w = useWorkflowStore()
const { protoRole, meta, theme, themeVars } = useProtoTheme()

const menu = ref(false)
const year = new Date().getFullYear()

const authed = computed(() => auth.isAuthenticated)
const isDash = computed(() => route.path.startsWith('/app'))
const isTrack = computed(() => route.path.startsWith('/track'))
const userName = computed(() => auth.user?.name || 'Printy user')
const initials = computed(() =>
  userName.value.split(' ').map(wrd => wrd[0]).slice(0, 2).join('').toUpperCase(),
)
const dashPath = computed(() => protoHomeRoute(protoRole.value))

const PUBLIC_NAV = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/track', label: 'Track a job' },
  { to: '/about', label: 'About' },
]

const footerCols = [
  {
    t: 'Product',
    links: [['How it works', '/how-it-works'], ['Track a job', '/track'], ['Get a quote', '/']],
  },
  {
    t: 'Company',
    links: [['About', '/about'], ['Contact', '/contact'], ['For printers', '/sign-up?mode=printer'], ['For managers', '/sign-up?mode=manager']],
  },
  {
    t: 'Legal',
    links: [['Terms', '/legal'], ['Privacy', '/legal'], ['Sign in', '/sign-in'], ['Create account', '/sign-up']],
  },
]

function navActive(to: string) {
  if (to === '/track') {
    return route.path.startsWith('/track')
  }
  return route.path === to
}

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

const switcherRoles = computed<Role[]>(() => {
  const set = new Set<Role>()
  ;(['buyer', 'manager', 'printer', 'admin'] as Role[]).forEach((r) => {
    if (r === 'admin') {
      if (auth.canAccessAdminDashboard) set.add(r)
      return
    }
    const d = dashboardForProto(r)
    if (r === 'buyer' && (d === 'client' || auth.canAccessClientDashboard)) set.add(r)
    if (r === 'manager' && (d === 'partner' || auth.canAccessPartnerDashboard)) set.add(r)
    if (r === 'printer' && (d === 'production' || auth.canAccessProductionDashboard)) set.add(r)
  })
  const fallback = protoRoleFor(auth.dashboardRole)
  if (set.size === 0) set.add(fallback)
  return [...set]
})

function roleIcon(r: Role) {
  return { buyer: ShoppingBag, manager: Radar, printer: PrinterIcon, admin: Gauge }[r]
}
function roleLabel(r: Role) {
  return ROLE_META[r].label
}
function roleAccent(r: Role) {
  return ROLE_META[r].theme.accent
}
function switchRole(r: Role) {
  auth.setActiveRole(dashboardForProto(r))
  w.setRole(r)
  return navigateTo(protoHomeRoute(r))
}
async function signOut() {
  w.setRole('buyer')
  await auth.logout()
  w.resetDemo()
}
function goQuote() {
  const isBuyer = authed.value && protoRole.value === 'buyer'
  if (isBuyer) {
    w.buyerTab = 'quote'
  }
  return navigateTo(quoteNavTarget(authed.value, protoRole.value))
}
async function resetDemo() {
  await w.resetDemo()
}

const liveNow = ref(formatLiveNow())
const clockInterval = setInterval(() => {
  liveNow.value = formatLiveNow()
}, 30000)
onUnmounted(() => clearInterval(clockInterval))
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