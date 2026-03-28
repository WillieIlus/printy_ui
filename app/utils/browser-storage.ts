type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const noopStorage: StorageLike = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

export function getBrowserStorage(): StorageLike {
  if (import.meta.client && typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }

  return noopStorage
}
