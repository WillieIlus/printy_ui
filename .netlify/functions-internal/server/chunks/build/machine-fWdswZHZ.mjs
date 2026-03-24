import { defineStore } from 'pinia';
import { x as useNuxtApp, A as API, w as parseApiError } from './server.mjs';

const useMachineStore = defineStore("machine", {
  state: () => ({
    machines: [],
    loading: false,
    error: null
  }),
  getters: {
    machineOptions: (state) => state.machines.map((m) => ({ label: m.name, value: m.id })),
    activeMachines: (state) => state.machines.filter((m) => m.is_active !== false)
  },
  actions: {
    async fetchMachines(shopSlug) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const response = await $api(API.shopMachines(shopSlug));
        this.machines = Array.isArray(response) ? response : response?.results ?? [];
        return this.machines;
      } catch (err) {
        this.error = parseApiError(err, "Failed to fetch machines");
        this.machines = [];
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async createMachine(shopSlug, data) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const payload = {
          name: data.name,
          machine_type: data.machine_type ?? data.type ?? "DIGITAL",
          max_width_mm: data.max_width_mm ?? null,
          max_height_mm: data.max_height_mm ?? null,
          min_gsm: data.min_gsm ?? null,
          max_gsm: data.max_gsm ?? null,
          is_active: data.is_active ?? true
        };
        const machine = await $api(API.shopMachines(shopSlug), {
          method: "POST",
          body: payload
        });
        this.machines.push(machine);
        return { success: true, machine };
      } catch (err) {
        const message = parseApiError(err, "Failed to create machine");
        this.error = message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateMachine(shopSlug, id, data) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const machine = await $api(API.shopMachineDetail(shopSlug, id), {
          method: "PATCH",
          body: data
        });
        const idx = this.machines.findIndex((m) => m.id === id);
        if (idx >= 0) this.machines[idx] = machine;
        return { success: true, machine };
      } catch (err) {
        this.error = parseApiError(err, "Failed to update machine");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteMachine(shopSlug, id) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        await $api(API.shopMachineDetail(shopSlug, id), { method: "DELETE" });
        this.machines = this.machines.filter((m) => m.id !== id);
        return { success: true };
      } catch (err) {
        this.error = parseApiError(err, "Failed to delete machine");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    clear() {
      this.machines = [];
      this.error = null;
    }
  }
});

export { useMachineStore as u };
//# sourceMappingURL=machine-fWdswZHZ.mjs.map
