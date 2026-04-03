import { H as useState } from './server.mjs';

function useSetupRedirectNotice() {
  const notice = useState("setup-redirect-notice", () => null);
  function pushNotice(payload) {
    notice.value = payload;
  }
  function clearNotice() {
    notice.value = null;
  }
  return {
    notice,
    pushNotice,
    clearNotice
  };
}

export { useSetupRedirectNotice as u };
//# sourceMappingURL=useSetupRedirectNotice-Bt9QfVIM.mjs.map
