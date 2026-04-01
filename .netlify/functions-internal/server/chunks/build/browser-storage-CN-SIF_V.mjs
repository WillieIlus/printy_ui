const noopStorage = {
  getItem: () => null,
  setItem: () => void 0,
  removeItem: () => void 0
};
function getBrowserStorage() {
  return noopStorage;
}

export { getBrowserStorage as g };
//# sourceMappingURL=browser-storage-CN-SIF_V.mjs.map
