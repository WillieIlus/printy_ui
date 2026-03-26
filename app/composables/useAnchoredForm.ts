export function useAnchoredForm() {
  function scrollToAnchor(anchorId: string, focusSelector?: string) {
    if (!import.meta.client) return
    requestAnimationFrame(() => {
      const target = document.getElementById(anchorId)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (focusSelector) {
        const focusTarget = target?.querySelector<HTMLElement>(focusSelector)
        focusTarget?.focus()
      }
    })
  }

  function scrollToFirstInvalid(formRoot?: HTMLElement | null) {
    if (!import.meta.client) return
    requestAnimationFrame(() => {
      const root = formRoot ?? document.body
      const invalid = root.querySelector<HTMLElement>(
        '[aria-invalid="true"], .has-invalid-field input, .has-invalid-field textarea, .has-invalid-field button, .has-invalid-field [role="combobox"]',
      )
      invalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      invalid?.focus()
    })
  }

  return {
    scrollToAnchor,
    scrollToFirstInvalid,
  }
}
