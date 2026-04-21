export type NotificationVariant = 'success' | 'info' | 'warning' | 'error'

type SlotClasses = Record<string, string>

interface NotificationVariantTheme {
  toast: SlotClasses
  alert: SlotClasses
}

const sharedCloseClasses = 'rounded-lg p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20'

export const notificationIcons: Record<NotificationVariant, string> = {
  success: 'i-lucide-circle-check-big',
  info: 'i-lucide-info',
  warning: 'i-lucide-triangle-alert',
  error: 'i-lucide-octagon-alert',
}

export const notificationThemeByVariant: Record<NotificationVariant, NotificationVariantTheme> = {
  success: {
    toast: {
      root: '!border-emerald-800 !bg-emerald-600 !text-white !ring-emerald-900/25 !shadow-[0_22px_48px_-24px_rgba(16,185,129,0.55)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-emerald-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-emerald-800 !bg-emerald-600 !text-white !ring-emerald-900/25 !shadow-[0_18px_38px_-24px_rgba(16,185,129,0.45)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-emerald-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
    },
  },
  info: {
    toast: {
      root: '!border-sky-800 !bg-sky-600 !text-white !ring-sky-900/25 !shadow-[0_22px_48px_-24px_rgba(59,130,246,0.55)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-sky-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-sky-800 !bg-sky-600 !text-white !ring-sky-900/25 !shadow-[0_18px_38px_-24px_rgba(59,130,246,0.45)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-sky-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
    },
  },
  warning: {
    toast: {
      root: '!border-amber-800 !bg-amber-600 !text-white !ring-amber-900/25 !shadow-[0_22px_48px_-24px_rgba(245,158,11,0.52)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-amber-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-amber-800 !bg-amber-600 !text-white !ring-amber-900/25 !shadow-[0_18px_38px_-24px_rgba(245,158,11,0.42)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-amber-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
    },
  },
  error: {
    toast: {
      root: '!border-rose-800 !bg-rose-600 !text-white !ring-rose-900/25 !shadow-[0_22px_48px_-24px_rgba(244,63,94,0.55)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-rose-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-rose-100 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-rose-800 !bg-rose-600 !text-white !ring-rose-900/25 !shadow-[0_18px_38px_-24px_rgba(244,63,94,0.42)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-rose-100',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-rose-100 hover:!bg-white/20 hover:!text-white`,
    },
  },
}

export const toastVariantClasses = Object.fromEntries(
  Object.entries(notificationThemeByVariant).map(([variant, theme]) => [variant, theme.toast]),
) as Record<NotificationVariant, SlotClasses>

export const alertCompoundVariants = Object.entries(notificationThemeByVariant).flatMap(([variant, theme]) => ([
  {
    color: variant,
    variant: 'soft',
    class: theme.alert,
  },
  {
    color: variant,
    variant: 'solid',
    class: theme.alert,
  },
  {
    color: variant,
    variant: 'subtle',
    class: theme.alert,
  },
  {
    color: variant,
    variant: 'outline',
    class: theme.alert,
  },
])) as Array<{ color: NotificationVariant; variant: 'soft' | 'solid' | 'subtle' | 'outline'; class: SlotClasses }>
