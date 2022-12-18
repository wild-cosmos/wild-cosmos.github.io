import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Warband } from '@/types/warband';

interface State {
  warbands: Warband[];
}

const generateId = ((id) => {
  let nextId = id;
  return () => {
    nextId += 1;
    return nextId;
  };
})(Date.now());

export const useWarbandStore = defineStore({
  id: 'warband',

  state: () => useLocalStorage<State>('wild-cosmos-warband', {
    warbands: [],
  }),

  getters: {
    getWarband: ({ warbands }) => (id : number) => warbands.find((w) => w.id === id),
  },

  actions: {
    setName({ id, name } : Warband) {
      const warband = this.getWarband(id);
      if (warband) warband.name = name;
    },

    add() {
      const warband : Warband = {
        id: generateId(),
        name: null,
        models: [],
      };

      this.warbands.push(warband);

      return warband;
    },

    remove(id : number) {
      const idx = this.warbands.findIndex((w) => w.id === id);
      if (idx > -1) this.warbands.splice(idx, 1);
    },
  },
});
