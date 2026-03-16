import { f as useToast } from './server.mjs';

function useNotification() {
  const toast = useToast();
  return {
    success(message, title = "Success") {
      toast.add({
        title,
        description: message,
        color: "success",
        icon: "i-lucide-check-circle"
      });
    },
    error(message, title = "Error") {
      toast.add({
        title,
        description: message,
        color: "error",
        icon: "i-lucide-alert-circle"
      });
    },
    warning(message, title = "Warning") {
      toast.add({
        title,
        description: message,
        color: "warning",
        icon: "i-lucide-alert-triangle"
      });
    },
    info(message, title = "Info") {
      toast.add({
        title,
        description: message,
        color: "info",
        icon: "i-lucide-info"
      });
    }
  };
}

export { useNotification as u };
//# sourceMappingURL=useNotification-Dn_AzVKG.mjs.map
