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
      root: '!border-emerald-700/80 !bg-[rgb(7_48_39)] !ring-emerald-700/65 !shadow-[0_22px_48px_-24px_rgba(16,185,129,0.55)]',
      title: '!text-emerald-50',
      description: '!text-emerald-100',
      icon: '!text-emerald-300',
      close: `${sharedCloseClasses} !text-emerald-200 hover:!bg-emerald-500/15 hover:!text-emerald-50`,
    },
    alert: {
      root: '!border-emerald-700/70 !bg-[rgb(7_48_39)] !text-emerald-50 !ring-emerald-700/60 !shadow-[0_18px_38px_-24px_rgba(16,185,129,0.45)]',
      title: '!text-emerald-50',
      description: '!text-emerald-100',
      icon: '!text-emerald-300',
      close: `${sharedCloseClasses} !text-emerald-200 hover:!bg-emerald-500/15 hover:!text-emerald-50`,
    },
  },
  info: {
    toast: {
      root: '!border-sky-700/80 !bg-[rgb(11_44_84)] !ring-sky-700/65 !shadow-[0_22px_48px_-24px_rgba(59,130,246,0.55)]',
      title: '!text-sky-50',
      description: '!text-sky-100',
      icon: '!text-sky-300',
      close: `${sharedCloseClasses} !text-sky-200 hover:!bg-sky-500/15 hover:!text-sky-50`,
    },
    alert: {
      root: '!border-sky-700/70 !bg-[rgb(11_44_84)] !text-sky-50 !ring-sky-700/60 !shadow-[0_18px_38px_-24px_rgba(59,130,246,0.45)]',
      title: '!text-sky-50',
      description: '!text-sky-100',
      icon: '!text-sky-300',
      close: `${sharedCloseClasses} !text-sky-200 hover:!bg-sky-500/15 hover:!text-sky-50`,
    },
  },
  warning: {
    toast: {
      root: '!border-amber-600/80 !bg-[rgb(89_49_12)] !ring-amber-600/65 !shadow-[0_22px_48px_-24px_rgba(245,158,11,0.52)]',
      title: '!text-amber-50',
      description: '!text-amber-100',
      icon: '!text-amber-300',
      close: `${sharedCloseClasses} !text-amber-200 hover:!bg-amber-400/15 hover:!text-amber-50`,
    },
    alert: {
      root: '!border-amber-600/70 !bg-[rgb(89_49_12)] !text-amber-50 !ring-amber-600/60 !shadow-[0_18px_38px_-24px_rgba(245,158,11,0.42)]',
      title: '!text-amber-50',
      description: '!text-amber-100',
      icon: '!text-amber-300',
      close: `${sharedCloseClasses} !text-amber-200 hover:!bg-amber-400/15 hover:!text-amber-50`,
    },
  },
  error: {
    toast: {
      root: '!border-rose-700/80 !bg-[rgb(94_25_36)] !ring-rose-700/65 !shadow-[0_22px_48px_-24px_rgba(244,63,94,0.55)]',
      title: '!text-rose-50',
      description: '!text-rose-100',
      icon: '!text-rose-300',
      close: `${sharedCloseClasses} !text-rose-200 hover:!bg-rose-500/15 hover:!text-rose-50`,
    },
    alert: {
      root: '!border-rose-700/70 !bg-[rgb(94_25_36)] !text-rose-50 !ring-rose-700/60 !shadow-[0_18px_38px_-24px_rgba(244,63,94,0.42)]',
      title: '!text-rose-50',
      description: '!text-rose-100',
      icon: '!text-rose-300',
      close: `${sharedCloseClasses} !text-rose-200 hover:!bg-rose-500/15 hover:!text-rose-50`,
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
