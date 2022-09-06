import { defineStore } from 'pinia';
import orderBy from 'lodash/orderBy';
import { useLocalStorage } from '@vueuse/core';
import { isArray } from 'lodash';
import { useDataStore } from './data';
import totalCost from '@/utils/totalCost';
import type {
  SquadUnit, Unit, Wargear, Weapon,
} from '@/types/unit';

const generateId = ((id) => {
  let nextId = id;
  return () => nextId++;
})(Date.now());

const createSquadUnit = () : SquadUnit => ({
  id: generateId(),
  faction: '',
  name: '',
  cost: 0,
  mv: [],
  bs: 0,
  cs: 0,
  df: 0,
  lf: 0,
  si: 0,
  ld: 0,
  abilities: [],
  type: [],
  role: '',
  wargear: [],
  weapons: [],
});

interface State {
  faction: string;
  name: string;
  id: number;
  units: SquadUnit[];
}

// eslint-disable-next-line import/prefer-default-export
export const useSquadStore = defineStore({
  id: 'squad',

  state: () => useLocalStorage<State>('wild-cosmos', {
    faction: 'None',
    name: '',
    id: 0,
    units: [],
  }),

  getters: {
    totalPoints: ({ units }) => units.reduce((total, unit) => total + totalCost(unit), 0),
  },

  actions: {
    clear() {
      this.$patch((state) => {
        state.units.splice(0);
      });
    },
    addSquadMember(unit: Unit) {
      const dataStore = useDataStore();

      const m = Object.entries(unit)
        .reduce((target, [property, value]) => {
          if (property in target) target[property] = value;
          return target;
        }, createSquadUnit());

      if (unit.roles.length > 0) {
        const [role] = unit.roles;
        Object.assign(m, { role });
      }

      const { weapons, wargear } = unit;

      m.weapons.push(...weapons?.map(dataStore.getWeapon));
      m.wargear.push(...wargear?.map(dataStore.getWargear));

      this.units.push(m as SquadUnit);

      return m;
    },
    duplicateSquadMember(unit: SquadUnit) {
      const newMember = { ...unit, id: generateId() };
      this.units.push(newMember);
    },
    removeSquadMember(unit: SquadUnit) {
      const idx = this.units.findIndex(({ id }) => id === unit.id);
      if (idx > -1) {
        this.units.splice(idx, 1);
      }
    },
    setSquadMember(squadId: number, unit: Unit) {
      const squadUnit = this.units.find(({ id }) => id === squadId);
      if (squadUnit) {
        Object.assign(squadUnit, unit);
      }
    },

    resetWargear(unit: SquadUnit): void {
      const dataStore = useDataStore();
      const model = dataStore.getUnitByName(unit.name);
      if (model) {
        this.$patch((state) => {
          const updateModel = state.units.find(({ id }) => id === unit.id);
          if (updateModel) {
            const { cost, weapons, wargear } = model;
            Object.assign(updateModel, {
              cost,
              weapons: weapons?.map(dataStore.getWeapon).map((w) => ({ ...w })),
              wargear: wargear?.map(dataStore.getWargear).map((w) => ({ ...w })),
            });
          }
        });
      }
    },

    addWargear(unit: SquadUnit, items: string | string[], cost = 0): void {
      const dataStore = useDataStore();

      this.$patch((state) => {
        const squadUnit = state.units.find(({ id }) => id === unit.id);
        if (squadUnit) {
          squadUnit.cost += cost;
          (isArray(items) ? items : [items])
            .map(dataStore.getWeapon)
            .forEach((weapon) => {
              if (weapon) squadUnit.weapons.push({ ...weapon });
            });
          (isArray(items) ? items : [items])
            .map(dataStore.getWargear)
            .forEach((wargear) => {
              if (wargear) squadUnit.wargear.push({ ...wargear });
            });
        }
      });
    },

    removeWargear(unit: SquadUnit, items: string | string[]): void {
      this.$patch((state) => {
        const squadUnit = state.units.find(({ id }) => id === unit.id);
        if (squadUnit) {
          (isArray(items) ? items : [items])
            .forEach((weaponName) => {
              const idx = squadUnit.weapons
                .findIndex(({ name }) => name === weaponName);
              if (idx > -1) {
                squadUnit.weapons.splice(idx, 1);
              }
            });
          (isArray(items) ? items : [items])
            .forEach((wargear) => {
              const idx = squadUnit.wargear
                .findIndex(({ name }) => name === wargear);
              if (idx > -1) {
                squadUnit.wargear.splice(idx, 1);
              }
            });
        }
      });
    },

    setRole(squadId: number, role: string) {
      const squadUnit = this.units.find(({ id }) => id === squadId);
      if (squadUnit) {
        Object.assign(squadUnit, { role });
      }
    },
  },
});
