export type NotificationVariant = 'success' | 'info' | 'warning' | 'error'

type SlotClasses = Record<string, string>

interface NotificationVariantTheme {
  toast: SlotClasses
  alert: SlotClasses
}

const sharedCloseClasses = 'rounded-lg p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25'

export const notificationIcons: Record<NotificationVariant, string> = {
  success: 'i-lucide-circle-check-big',
  info: 'i-lucide-info',
  warning: 'i-lucide-triangle-alert',
  error: 'i-lucide-octagon-alert',
}

export const notificationThemeByVariant: Record<NotificationVariant, NotificationVariantTheme> = {
  success: {
    toast: {
      root: '!border-transparent !bg-[var(--p-success)] !text-white !ring-black/10 !shadow-[var(--shadow-modal)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-transparent !bg-[var(--p-success)] !text-white !ring-black/10 !shadow-[var(--shadow-panel)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
    },
  },
  info: {
    toast: {
      root: '!border-transparent !bg-[var(--p-secondary)] !text-white !ring-black/10 !shadow-[var(--shadow-modal)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-transparent !bg-[var(--p-secondary)] !text-white !ring-black/10 !shadow-[var(--shadow-panel)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
    },
  },
  warning: {
    toast: {
      root: '!border-transparent !bg-[var(--p-warning)] !text-white !ring-black/10 !shadow-[var(--shadow-modal)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-transparent !bg-[var(--p-warning)] !text-white !ring-black/10 !shadow-[var(--shadow-panel)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
    },
  },
  error: {
    toast: {
      root: '!border-transparent !bg-[var(--p-error)] !text-white !ring-black/10 !shadow-[var(--shadow-modal)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
      progress: '!bg-white/30',
    },
    alert: {
      root: '!border-transparent !bg-[var(--p-error)] !text-white !ring-black/10 !shadow-[var(--shadow-panel)] !backdrop-blur-none',
      title: '!text-white',
      description: '!text-white/90',
      icon: '!text-white',
      close: `${sharedCloseClasses} !text-white/90 hover:!bg-white/20 hover:!text-white`,
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
