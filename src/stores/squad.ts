import { defineStore } from 'pinia';
import { isArray, isObject } from 'lodash-es';
import type { SquadUnit, Unit } from '@/types/unit';
import type { Warband } from '@/types/warband';
import generateId from '@/utils/id-helper';
import { useDataStore } from './data';
import { useWarbandStore } from './warband';

const createSquadUnit = (): SquadUnit => ({
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
  limits: null,
});

interface State {
  faction: string;
  name: string | null;
  id: number | null;
  models: SquadUnit[];
}

// eslint-disable-next-line import/prefer-default-export
export const useSquadStore = defineStore({
  id: 'squad',

  state: (): State => ({
    faction: 'None',
    name: null,
    id: null,
    models: [],
  }),

  getters: {
    totalPoints: ({ models }) => models.reduce((total, model) => total + model.cost, 0),

    getModelsWithItem: ({ models }) => (itemName: string) => models.filter(({ weapons, wargear }) => {
      if (weapons.some(({ name }) => name === itemName)) return true;
      if (wargear.some(({ name }) => name === itemName)) return true;
      return false;
    }),

    getWargearCountInWarband: ({ models }) => models.reduce((items: { [key: string]: number }, { wargear, weapons }) => {
      wargear?.forEach(({ name }) => {
        if (name in items) {
          items[name] += 1;
        } else {
          items[name] = 1;
        }
      });
      weapons?.forEach(({ name }) => {
        if (name in items) {
          items[name] += 1;
        } else {
          items[name] = 1;
        }
      });
      return items;
    }, {}),
  },

  actions: {
    selectWarband(id: number) {
      const warbandStore = useWarbandStore();
      const selectedWarband = warbandStore.getWarband(id);
      this.$patch((state) => {
        if (selectedWarband) {
          Object.assign(state, selectedWarband);
        } else {
          this.$reset();
        }
      });
    },

    setName(name: string) {
      this.name = name;
      const warbandStore = useWarbandStore();
      const { id } = this;
      warbandStore.setName({ id, name } as Warband);
    },

    clear() {
      this.$patch((state) => {
        state.models.splice(0);
      });
    },
    addSquadMember(model: Unit) {
      const { getWeapon, getWargear } = useDataStore();

      const m = Object.entries(model)
        .reduce((target: { [key: string]: any }, [property, value]: [string, any]) => {
          if (property in target) target[property] = value;
          return target;
        }, createSquadUnit());

      if (typeof model.roles !== 'string') {
        const getDefaultRole = ({ roles }: Unit) => {
          let role = roles;
          if (isArray(roles)) {
            [role] = roles;
          } else if (isObject(roles)) {
            [role] = Object.keys(roles);
          }
          return role;
        };
        Object.assign(m, { role: getDefaultRole(model) });
      }

      const { weapons = [], wargear = [] } = model;
      const defaultItems = [
        ...weapons,
        ...wargear,
      ];
      m.weapons = defaultItems.map(getWeapon).filter((w) => !!w);
      m.wargear = (wargear ?? []).map(getWargear).filter(((w) => !!w));

      this.models.push(m as SquadUnit);

      return m;
    },
    duplicateSquadMember(model: SquadUnit) {
      const { weapons, wargear } = model;
      const newMember = {
        ...model,
        id: generateId(),
        weapons: [...weapons],
        wargear: [...wargear],
      };
      this.models.push(newMember);
    },
    removeSquadMember(model: SquadUnit) {
      const idx = this.models.findIndex(({ id }) => id === model.id);
      if (idx > -1) {
        this.models.splice(idx, 1);
      }
    },
    setSquadMember(squadId: number, model: Unit) {
      const squadUnit = this.models.find(({ id }) => id === squadId);
      if (squadUnit) {
        Object.assign(squadUnit, model);
      }
    },

    resetWargear(unit: SquadUnit): void {
      const dataStore = useDataStore();
      const model = dataStore.getModelByName(unit.name);
      if (model) {
        this.$patch((state) => {
          const updateModel = state.models.find(({ id }) => id === unit.id);
          if (updateModel) {
            const { cost, weapons = [], wargear = [] } = model;
            const defaultItems = [...wargear, ...weapons];
            Object.assign(updateModel, {
              cost,
              weapons: defaultItems.map(dataStore.getWeapon).filter((w) => !!w),
              wargear: defaultItems.map(dataStore.getWargear).filter((w) => !!w),
            });
          }
        });
      }
    },

    addWargear(unit: SquadUnit, items: string | string[], cost = 0): void {
      const dataStore = useDataStore();

      this.$patch((state) => {
        const squadUnit = state.models.find(({ id }) => id === unit.id);
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
        const squadUnit = state.models.find(({ id }) => id === unit.id);
        if (squadUnit) {
          (isArray(items) ? items : [items])
            .forEach((weaponName) => {
              const idx = squadUnit.weapons
                .filter((weapon) => !!weapon)
                .findIndex(({ name }) => name === weaponName);
              if (idx > -1) {
                squadUnit.weapons.splice(idx, 1);
              }
            });
          (isArray(items) ? items : [items])
            .forEach((wargearName) => {
              const idx = squadUnit.wargear
                .filter((wargear) => !!wargear)
                .findIndex(({ name }) => name === wargearName);
              if (idx > -1) {
                squadUnit.wargear.splice(idx, 1);
              }
            });
        }
      });
    },

    setRole(squadId: number, role: string) {
      const squadUnit = this.models.find(({ id }) => id === squadId);
      if (squadUnit) {
        const { getModelByName } = useDataStore();
        Object.assign(squadUnit, { role });
        const model = getModelByName(squadUnit.name);
        const roleStats = model?.roles[role];
        if (roleStats) Object.assign(squadUnit, roleStats);
      }
    },
  },
});
