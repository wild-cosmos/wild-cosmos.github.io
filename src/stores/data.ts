import { defineStore } from 'pinia'
import { mande } from 'mande'

interface Unit {
    faction: string;
    name: string;
    cost: number;
    mv: Array<string>;
    bs: number;
    cs: number;
    df: number;
    lf: number;
    si: number;
    ld: number;
    roles: Array<string>;
    type: string;
    abilities: Array<string>;
}

interface Ability {
    faction: string;
    name: string;
    cost: number;
}

interface Wargear {
    type: string;
    name: string;
    cost: number;
}

interface Weapon extends Wargear {
    usedBy: Array<string>
}

interface Faction {
    units: Array<Unit>,
    weapon: Array<Weapon>
}

// interface State {
//     factions: Array<string>,
//     units: Array<Unit>,
//     wargear: Array<Wargear>,
//     weapons: Array<Weapon>
// }

const api = mande('/');

export const useDataStore = defineStore({
    id: 'data',

    state: () => ({
        factions: [] as Array<string>,
        abilities: [] as Array<Ability>,
        units: [] as Array<Unit>,
        wargear: [] as Array<Wargear>,
        weapons: [] as Array<Weapon>
    }),

    getters: {
        getUnitsForFaction: (state) => (faction: string) => state.units.filter((unit: Unit) => unit.faction === faction),
        getWeaponsForUnit: (state) => (unitName: string) => state.weapons.filter(({ usedBy }) => usedBy.includes(unitName)),
    },

    actions: {
        initialise(dataUrl: string) {
            api.get<any>(dataUrl)
                .then((data) => {
                    this.$patch((state) => {
                        Object.keys(data).forEach((faction: string) => {
                            state.factions.push(faction);
                            if (data[faction]) {
                                const { units, weapons, abilities, wargear } = data[faction]

                                if (abilities)
                                    state.abilities.push(...abilities.map((ability: Ability) => ({ ...ability, faction })));
                                if (units)
                                    state.units.push(...units.map((unit: Unit) => ({ ...unit, faction })));
                                if (weapons)
                                    state.weapons.push(...weapons.map((weapon: Weapon) => ({ ...weapon, faction })));
                                if (wargear)
                                    state.wargear.push(...wargear.map((wargear: Wargear) => ({ ...wargear, faction })));
                            }
                        })
                    })
                })
        }
    }
})

