import { defineStore } from 'pinia'
import { mande } from 'mande'

interface SquadMember {
    id: number;
    name: string | null;
    cost: number;
}

let _id = 0;

interface State {
    faction: string;
    id: number;
    units: Array<SquadMember>;
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

    totalCost(): number {
        return this.cost + (this.weapon?.cost ?? 0)
    }
}

export const useSquadStore = defineStore({
    id: 'squad',

    state: (): State => ({
        faction: 'None',
        id: 0,
        units: [] as Array<SquadMember>,
    }),

    getters: {
        totalPoints: ({ units }) => units.reduce((total, unit) => total + unit.totalCost(), 0)
    },

    actions: {
        addSquadMember() {
            this.units.push(new SquadMember())
        },
        duplicateSquadMember(unit: SquadMember) {
            const newMember = new SquadMember();
            newMember.name = unit.name;
            newMember.cost = unit.cost;

            this.units.push(newMember);
        },
        removeSquadMember(unit: SquadMember) {
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
        }
    }
});