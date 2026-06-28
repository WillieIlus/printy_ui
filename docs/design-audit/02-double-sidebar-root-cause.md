## Confirmed Findings

`app/layouts/dashboard.vue` renders `DashboardShell variant="dashboard"` and provides a `DashboardSidebar` in its `#sidebar` slot before rendering the page content through `<slot />`. Therefore, a page using `layout: 'dashboard'` while also rendering `<RoleDashboardFrame>` directly would render two dashboard navigation shells.

No current role-dashboard page combines `layout: 'dashboard'` with direct `<RoleDashboardFrame>` rendering. All direct `RoleDashboardFrame` pages set `layout: false`.

| Route | Layout resolved | Renders RoleDashboardFrame? (Y/N) | Double-nav risk (Y/N) | Confidence |
| --- | --- | --- | --- | --- |
| `/dashboard` | default layout; redirects via `navigateTo(auth.homeRoute)` | N | N | High |
| `/dashboard/admin` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/client` (`app/pages/dashboard/client.vue`) | default layout; nested route host with `<NuxtPage />` | N | N | High |
| `/dashboard/client` (`app/pages/dashboard/client/index.vue`) | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/client/[section]` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/client/[section]/[id]` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/partner` (`app/pages/dashboard/partner.vue`) | default layout; nested route host with `<NuxtPage />` | N | N | High |
| `/dashboard/partner` (`app/pages/dashboard/partner/index.vue`) | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/partner/[section]` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/partner/messages` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/partner/quotes/[id]` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/partner/rate-card` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/printshop/jobs/[id]/breakdown` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/production/[section]` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/production/assignments/[id]` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/production/jobs/[id]` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/production/messages` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/production` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/production/onboarding` | no Nuxt layout (`layout: false`) | Y | N | High |
| `/dashboard/production/setup` | default layout; redirects to `/dashboard/production/onboarding` | N | N | High |
| `/intake/select-manager` | no Nuxt layout (`layout: false`) | Y | N | High |

Opposite failure check: no route was found with `layout: false` and no direct `<RoleDashboardFrame>`, so there is no confirmed missing-sidebar case from this pattern.

## Root Cause (Take 2)

`app/app.vue` does not render any persistent shell, sidebar, or auth-aware navigation outside Nuxt layout handling. It renders only `NuxtRouteAnnouncer`, `NuxtLoadingIndicator`, and:

```vue
<NuxtLayout>
  <NuxtPage />
</NuxtLayout>
```

`app/components/dashboard/RoleDashboardFrame.vue` does not import or render `DashboardShell.vue`. It does import and render one `DashboardTopbar` and one `DashboardSidebar`. The sidebar instance is at `RoleDashboardFrame.vue:180`; its nav list is the single `<nav>` at `RoleDashboardFrame.vue:185`.

`app/components/layout/DashboardSidebar.vue` is a thin wrapper: one `<aside>` at `DashboardSidebar.vue:2`, one `<slot />` at `DashboardSidebar.vue:3`, and no internal nav list. It does not duplicate slotted navigation.

The only confirmed second dashboard-shell source remains architectural drift: `app/layouts/dashboard.vue` renders `DashboardShell` at `dashboard.vue:2`, `DashboardSidebar` at `dashboard.vue:4`, a sidebar `<nav>` at `dashboard.vue:10`, and `DashboardTopbar` at `dashboard.vue:31`. If a page that renders `RoleDashboardFrame` were changed to `layout: 'dashboard'`, the layout sidebar would wrap the page and the frame sidebar would render inside it. In that hypothetical mixed state, the `RoleDashboardFrame` sidebar would be the inner/content-level sidebar, while the `app/layouts/dashboard.vue` sidebar would be the outer layout sidebar.

No current Vue component tree evidence shows true duplicate sidebar DOM for the audited role routes. The current role pages render `RoleDashboardFrame` with `layout: false`, and the root app does not add another sidebar around them.

Responsive visibility check: `RoleDashboardFrame.vue` uses mobile-only controls with `lg:hidden` and desktop-only topbar content with `hidden lg:flex`. Its sidebar passes `:class="mobileNavOpen ? 'flex' : 'hidden'"`, while `DashboardSidebar.vue` always contributes `lg:flex`. This means the same sidebar is hidden on small screens until opened and visible on large screens. That is one sidebar element, not separate mobile and desktop sidebar elements. If the reported doubled sidebar is reproducible despite this tree, the next investigation should inspect rendered DOM and computed CSS in the browser for a responsive/CSS visibility issue or stale built assets rather than page-level layout mixing.

Pattern checks:

| Search | Result |
| --- | --- |
| `rg -n "layout\\s*:\\s*['\\\"]dashboard['\\\"]" app/pages` | No matches |
| `rg -n "<RoleDashboardFrame" app/pages` | 17 matches: all role-dashboard frame pages plus `/intake/select-manager` |
| `rg -n "definePageMeta" app/pages/dashboard` | Dashboard frame pages use `layout: false`; `/dashboard`, `/dashboard/production/setup`, and nested host pages do not render `RoleDashboardFrame` |
