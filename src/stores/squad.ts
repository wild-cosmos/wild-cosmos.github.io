import { defineStore } from 'pinia'
import { useDataStore } from './data'
import orderBy from 'lodash/orderBy'
import { useLocalStorage } from "@vueuse/core";
import totalCost from "@/utils/totalCost";
import type { SquadUnit, Unit, Wargear, Weapon } from '@/types/unit';

interface SquadMember {
    id: number;
    name: string | null;
    cost: number;
}

let _id = 0;

interface State {
    faction: string;
    id: number;
}

class SquadMember implements SquadMember {
    id: number;
    name: string | null;
    cost: number;
    unit?: Unit;
    weapon?: any;

    constructor() {
        this.id = _id++;
        this.name = null;
        this.cost = 0;
    }

    duplicate(): SquadMember {
        const copy = new SquadMember();
        copy.name = this.name;
        copy.cost = this.cost;

        return copy;
    }
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
        addSquadMember(unit: Unit) {
            const dataStore = useDataStore();

            const m = new SquadMember()
            Object.assign(m, { ...unit })

            const availableWeapons = dataStore.getWeaponsForUnit(unit);
            if (availableWeapons.length > 0) {
                const [defaultWeapon] = orderBy(availableWeapons, ['cost']);
                Object.assign(m, { weapon: defaultWeapon })
            }
            this.units.push(m)

            return m;
        },
            const newMember = new SquadMember();
            newMember.name = unit.name;
            newMember.cost = unit.cost;

        duplicateSquadMember(unit: SquadUnit) {
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
        setWeapon(squadId: number, weapon: any) {
            const squadUnit = this.units.find(({ id }) => id === squadId);
            if (squadUnit) {
                Object.assign(squadUnit, { weapon })
            }
        },
        setRole(squadId: number, role: string) {
            const squadUnit = this.units.find(({ id }) => id === squadId);
            if (squadUnit) {
                Object.assign(squadUnit, { role })
            }
        }
    }
});