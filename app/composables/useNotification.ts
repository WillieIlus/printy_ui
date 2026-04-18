import { notificationIcons } from '~/utils/notification-theme'

export function useNotification() {
  const toast = useToast()
  return {
    success(message: string, title = 'Success') {
      toast.add({
        title,
        description: message,
        color: 'success',
        icon: notificationIcons.success,
      })
    },
    error(message: string, title = 'Error') {
      toast.add({
        title,
        description: message,
        color: 'error',
        icon: notificationIcons.error,
      })
    },
    warning(message: string, title = 'Warning') {
      toast.add({
        title,
        description: message,
        color: 'warning',
        icon: notificationIcons.warning,
      })
    },
    info(message: string, title = 'Info') {
      toast.add({
        title,
        description: message,
        color: 'info',
        icon: notificationIcons.info,
      })
    },
  }
}
