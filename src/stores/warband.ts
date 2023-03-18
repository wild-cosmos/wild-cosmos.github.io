import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Warband } from '@/types/warband';
import generateId from '@/utils/id-helper';

interface State {
  warbands: Warband[];
}

// eslint-disable-next-line import/prefer-default-export
export const useWarbandStore = defineStore({
  id: 'warband',

  state: () => ({
    warbands: useLocalStorage('wild-cosmos-warband', []),
  }),

  getters: {
    getWarband: (state) => (id: number) => state.warbands.find((w) => w.id === id),
  },

  actions: {
    updateWarband(id: number, update: WarbandUpdate) {
      const warband = this.getWarband(id);
      if (warband) Object.assign(warband, update);

      return warband;
    },

    add() {
      const warband: Warband = {
        id: generateId(),
        name: '',
        fluff: '',
        models: [],
      };

      this.warbands.push(warband);

      return warband;
    },

    remove(id: number) {
      const idx = this.warbands.findIndex((w) => w.id === id);
      if (idx > -1) this.warbands.splice(idx, 1);
    },
  },
});
