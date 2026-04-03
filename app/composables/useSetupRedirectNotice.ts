export interface SetupRedirectNotice {
  title: string
  description: string
}

export function useSetupRedirectNotice() {
  const notice = useState<SetupRedirectNotice | null>('setup-redirect-notice', () => null)

  function pushNotice(payload: SetupRedirectNotice) {
    notice.value = payload
  }

  function clearNotice() {
    notice.value = null
  }

  return {
    notice,
    pushNotice,
    clearNotice,
  }
}
