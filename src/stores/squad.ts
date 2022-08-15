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

    constructor() {
        this.id = _id++;
        this.name = null;
        this.cost = 0;
    }

    duplicate() {
        const copy = new SquadMember();
        copy.name = this.name;
        copy.cost = this.cost;
    }
}

export const useSquadStore = defineStore({
    id: 'squad',

    state: () : State => ({
        faction: 'None',
        id: 0,
        units: [] as Array<SquadMember>,
    }),

    getters: {
        totalPoints: ({units}) => units.reduce((total, { cost }) => {
            return total + cost
        }, 0)
    },

    actions: {
        addSquadMember() {
            this.units.push(new SquadMember())
        },
        duplicateSquadMember(unit : SquadMember) {
            const newMember = new SquadMember();
            newMember.name = unit.name;
            newMember.cost = unit.cost;

            this.units.push(newMember);
        },
        removeSquadMember(unit : SquadMember) {
            const idx = this.units.findIndex(({id}) => id === unit.id);
            if (idx > -1) {
                this.units.splice(idx, 1);
            }
        }
    }
});