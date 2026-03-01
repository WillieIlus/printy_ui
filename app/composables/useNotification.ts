export function useNotification() {
  const toast = useToast()
  return {
    success(message: string, title = 'Success') {
      toast.add({
        title,
        description: message,
        color: 'success',
        icon: 'i-lucide-check-circle',
      })
    },
    error(message: string, title = 'Error') {
      toast.add({
        title,
        description: message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    },
    warning(message: string, title = 'Warning') {
      toast.add({
        title,
        description: message,
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
    },
    info(message: string, title = 'Info') {
      toast.add({
        title,
        description: message,
        color: 'info',
        icon: 'i-lucide-info',
      })
    },
  }
}
