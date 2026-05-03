import { defineStore } from 'pinia'

export interface PendingAction {
  name: string
  payload: unknown
  redirectPath?: string
}

export const usePendingActionStore = defineStore('pendingAction', {
  state: () => ({
    action: null as PendingAction | null,
  }),
  actions: {
    setAction(action: PendingAction) {
      this.action = action
    },
    clearAction() {
      this.action = null
    },
  },
  persist: true,
})
