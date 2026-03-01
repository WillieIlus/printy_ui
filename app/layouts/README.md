# Layouts

Use `definePageMeta({ layout: 'name' })` or the `<NuxtLayout>` component to pick a layout.

| Layout      | Use case |
|------------|----------|
| **default** | Public/marketing: header, main content (optional container), footer. Slots: `header`, `breadcrumb`, `title`, `actions`, `footer`. Props: `container`, `showFooter`. |
| **auth**    | Login, signup, forgot password: centered card, theme toggle, back link. Slots: `branding`, `title`, `subtitle`, default (form), `footer`. Props: `backTo`, `backLabel`, `title`, `subtitle`, `showBranding`. |
| **admin**   | Admin panel: top bar + sidebar (Overview, Users, Shops, Claims, Settings). Slots: `title`, `actions`, `topbar-end`, `sidebar-footer`. |
| **dashboard** | Shop owner: top bar + sidebar (Dashboard, Profile, My Shops, My Quotes, Claims) and dynamic “My Shops” list. Slots: `title`, `actions`, `topbar-end`, `sidebar-footer`. |
| **blank**   | Minimal chrome: just slot + notifications. Props: `center` (for error-style centering). |

## Examples

**Page with default layout and custom title/actions:**
```vue
<template>
  <div>
    <template #title>
      <h1>My Page</h1>
    </template>
    <template #actions>
      <UButton>Add</UButton>
    </template>
    <p>Content here.</p>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>
```

**Auth page with title/subtitle:**
```vue
<template>
  <NuxtLayout name="auth" title="Sign in" subtitle="Enter your credentials." back-to="/">
    <LoginForm />
    <template #footer>
      <p class="text-sm text-gray-600">Don't have an account? <NuxtLink to="/auth/signup">Sign up</NuxtLink></p>
    </template>
  </NuxtLayout>
</template>
```

**Full-bleed default (no container, no footer):**
```vue
<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>
<template>
  <NuxtLayout :container="false" :show-footer="false">
    <div>Full-width content</div>
  </NuxtLayout>
</template>
```

Note: Layout props must be passed when using `<NuxtLayout>`; with `definePageMeta({ layout: 'default' })` you cannot pass props. Use slots or a wrapper page to customize.
