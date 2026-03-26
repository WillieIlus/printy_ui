import { k as useNuxtApp, A as API } from './server.mjs';

function useJobRequests() {
  const { $api } = useNuxtApp();
  async function list(params) {
    return $api(API.jobRequests(), { params });
  }
  async function get(id) {
    return $api(API.jobRequestDetail(id));
  }
  async function create(payload) {
    return $api(API.jobRequests(), { method: "POST", body: payload });
  }
  async function whatsappShare(id) {
    return $api(API.jobRequestWhatsappShare(id), {
      method: "POST",
      body: {}
    });
  }
  async function createClaim(jobId, payload) {
    return $api(API.jobRequestClaims(jobId), {
      method: "POST",
      body: payload ?? {}
    });
  }
  return { list, get, create, whatsappShare, createClaim };
}
function useJobClaims() {
  const { $api } = useNuxtApp();
  async function list(params) {
    return $api(API.jobClaims(), { params });
  }
  async function accept(claimId) {
    return $api(API.jobClaimAccept(claimId), { method: "POST", body: {} });
  }
  async function reject(claimId) {
    return $api(API.jobClaimReject(claimId), { method: "POST", body: {} });
  }
  return { list, accept, reject };
}
function usePublicJob() {
  const { $api } = useNuxtApp();
  async function getByToken(token) {
    return $api(API.publicJob(token));
  }
  return { getByToken };
}

export { useJobRequests as a, useJobClaims as b, usePublicJob as u };
//# sourceMappingURL=useJobRequests-CStOb5H3.mjs.map
