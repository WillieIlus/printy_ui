import { alertCompoundVariants, toastVariantClasses } from './app/utils/notification-theme'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'flamingo',
      neutral: 'slate',
    },
    input: {
      variants: {
        outline: 'rounded-lg border-[var(--p-border)] bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm hover:border-[var(--p-text-muted)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error: 'rounded-lg border-red-500 bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      },
    },
    textarea: {
      variants: {
        outline: 'rounded-lg border-[var(--p-border)] bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm hover:border-[var(--p-text-muted)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error: 'rounded-lg border-red-500 bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      },
    },
    card: {
      slots: {
        root: 'bg-[var(--p-surface)] border border-[var(--p-border)] rounded-xl shadow-md',
        header: 'border-b border-[var(--p-border-dim)]',
        footer: 'border-t border-[var(--p-border-dim)]',
      },
    },
    modal: {
      slots: {
        overlay: 'bg-black/50 backdrop-blur-sm',
        content: 'bg-[var(--p-surface-raised)] border border-[var(--p-border)] rounded-xl shadow-lg',
      },
    },
    toaster: {
      defaultVariants: {
        position: 'top-right',
      },
      slots: {
        viewport: 'pointer-events-none fixed z-[110] flex flex-col gap-3 focus:outline-none left-4 right-4 top-[max(1rem,env(safe-area-inset-top))] w-auto max-w-[calc(100vw-2rem)] sm:left-auto sm:right-4 sm:w-96 sm:max-w-[min(24rem,calc(100vw-2rem))]',
      },
    },
    toast: {
      slots: {
        root: 'pointer-events-auto relative flex w-full max-w-full min-w-0 items-start gap-3 overflow-hidden rounded-2xl border p-4 ring-1 ring-inset ring-white/8 shadow-2xl',
        wrapper: 'min-w-0 flex-1',
        title: 'min-w-0 text-sm font-semibold break-words [overflow-wrap:anywhere]',
        description: 'min-w-0 whitespace-normal text-sm leading-6 break-words [overflow-wrap:anywhere]',
        icon: 'shrink-0 size-5 mt-0.5',
        actions: 'shrink-0',
        close: 'shrink-0 rounded-lg',
      },
      variants: {
        color: {
          ...toastVariantClasses,
          neutral: {
            root: 'bg-[var(--p-surface-raised)] border-[var(--p-border)] shadow-[0_22px_48px_-28px_rgba(15,23,42,0.8)]',
            title: 'text-[var(--p-text)]',
            description: 'text-[var(--p-text-muted)]',
            icon: 'text-[var(--p-text-muted)]',
            close: 'rounded-lg p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10',
          },
        },
      },
    },
    alert: {
      slots: {
        root: 'relative flex w-full gap-3 overflow-hidden rounded-2xl border p-4 ring-1 ring-inset ring-white/6',
        wrapper: 'min-w-0 flex-1',
        title: 'text-sm font-semibold',
        description: 'mt-1 text-sm leading-6',
        icon: 'mt-0.5 shrink-0 size-5',
        actions: 'mt-3 flex flex-wrap gap-2',
        close: 'shrink-0 rounded-lg',
      },
      compoundVariants: [
        ...alertCompoundVariants,
        {
          color: 'neutral',
          variant: 'soft',
          class: {
            root: 'border-[var(--p-border)] bg-[var(--p-surface-raised)] text-[var(--p-text)] shadow-[0_18px_38px_-24px_rgba(15,23,42,0.75)]',
            title: 'text-[var(--p-text)]',
            description: 'text-[var(--p-text-muted)]',
            icon: 'text-[var(--p-text-muted)]',
            close: 'rounded-lg p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10',
          },
        },
        {
          color: 'neutral',
          variant: 'solid',
          class: {
            root: 'border-[var(--p-border)] bg-[var(--p-surface-raised)] text-[var(--p-text)] shadow-[0_18px_38px_-24px_rgba(15,23,42,0.75)]',
            title: 'text-[var(--p-text)]',
            description: 'text-[var(--p-text-muted)]',
            icon: 'text-[var(--p-text-muted)]',
            close: 'rounded-lg p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10',
          },
        },
      ],
      defaultVariants: {
        variant: 'soft',
      },
    },
    selectMenu: {
      slots: {
        base: 'softui-control relative w-full min-h-10 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm transition-colors hover:border-[var(--p-text-muted)] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:text-[var(--p-text-muted)] disabled:opacity-70',
        trigger: 'flex min-h-10 w-full items-center gap-2 bg-transparent px-4 py-2 pe-10 text-sm font-medium leading-5 text-[var(--p-text)]',
        value: 'min-w-0 flex-1 truncate pe-1 text-[var(--p-text)]',
        placeholder: 'min-w-0 flex-1 truncate pe-1 text-sm text-[var(--p-text-muted)]',
        trailing: 'pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3',
        trailingIcon: 'h-4 w-4 shrink-0 text-[var(--p-text-muted)]',
        content: 'z-[100000] bg-[var(--p-surface-raised)] border border-[var(--p-border)] rounded-xl shadow-lg',
        viewport: 'max-h-72 overflow-y-auto p-1',
        item: 'text-[var(--p-text)] data-highlighted:not-data-disabled:before:bg-[var(--p-surface-sunken)] data-highlighted:not-data-disabled:text-[var(--p-text)]',
      },
    },
  },
})
