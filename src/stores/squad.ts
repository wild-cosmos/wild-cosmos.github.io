import { defineStore } from 'pinia'
import { useDataStore } from './data'
import orderBy from 'lodash/orderBy'
import { useLocalStorage } from "@vueuse/core";
import totalCost from "@/utils/totalCost";
import type { SquadUnit, Unit, Wargear, Weapon } from '@/types/unit';

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
    id: number;
    units: SquadUnit[];
}

export const useSquadStore = defineStore({
    id: 'squad',

    state: () => useLocalStorage<State>("wild-cosmos", {
        faction: 'None',
        id: 0,
        units: [],
    }),
    
    getters: {
        totalPoints: ({ units }) => units.reduce((total, unit) => total + totalCost(unit), 0)
    },

    actions: {
      clear() {
        this.$patch((state) => {
          state.units.splice(0);
        })
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

            const loadout = unit.options?.find(({ cost }) => cost === 0);
            if (loadout) {
              const { weapons, wargear } = loadout;
            
              if (weapons) m.weapons.push(...weapons.map(dataStore.getWeapon));
              if (wargear) m.wargear.push(...wargear.map(dataStore.getWargear));
            }

            if (!unit.options?.length) { 
              const availableWeapons = dataStore.getWeaponsForUnit(m);
              if (availableWeapons.length > 0) {
                const [defaultWeapon] = orderBy(availableWeapons, ['cost']);
                Object.assign(m, { weapons: [defaultWeapon] })
              }
            }

            this.units.push(m as SquadUnit)

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
                Object.assign(squadUnit, unit)
            }
        },
        setWargear(squadId: number, wargear: Wargear[]) {
          this.$patch((state) => {
            const squadUnit = state.units.find(({ id }) => id === squadId);
            if (squadUnit) {
              Object.assign(squadUnit, { wargear });
            }              
          });
        },
        setWeapon(squadId: number, weapon: Weapon) {
            const squadUnit = this.units.find(({ id }) => id === squadId);
            if (squadUnit) {
                Object.assign(squadUnit, { weapon })
            }
        },
        setWeapons(squadId: number, weapons: Weapon[], overrideCost = 0) : void {
          if (overrideCost) {
            this.setWeapons(squadId, weapons.map((w, idx) => ({
              ...w,
              cost: idx === 0 ? overrideCost : 0,
            })));
            return;
          }
          this.$patch((state) => {
            const squadUnit = state.units.find(({ id }) => id === squadId);
            if (squadUnit) {
              Object.assign(squadUnit, { weapons: [...weapons] });
            }              
          });
        },
        setRole(squadId: number, role: string) {
            const squadUnit = this.units.find(({ id }) => id === squadId);
            if (squadUnit) {
                Object.assign(squadUnit, { role })
            }
        }
    }
});