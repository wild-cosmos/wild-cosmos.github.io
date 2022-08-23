import { defineStore } from 'pinia'
import { mande } from 'mande'
import isArray from 'lodash/isArray'

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
    usedBy: Array<string>;
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
        getWargear: ({ wargear }) => (wargearName: string) => wargear.find(({ name }) => name === wargearName),
        getWargearForUnit: ({ wargear }) => (unitName: string) => wargear.filter(({ usedBy }) => usedBy?.includes(unitName)),
        getWeaponsForUnit: ({ weapons, getWeapon }) => (unit: Unit) => {
            debugger;
            if (unit.weapons) {
                return unit.weapons.map((w: string) => {
                  if (isArray(w)) {
                    const { name, cost } = w.map((name) => getWeapon(name) || this.getWargear(name))
                      .filter((w) => !!w)
                      .reduce((m, { name, cost }) => {
                        m.name.push(name)
                        m.cost.push(cost);
                        return m
                      }, { name: [] as Array<string>, cost: [] as Array<number> })
                    return {
                      name: name.join('/'),
                      cost: cost.reduce((sum: number, v: number) => sum + v, 0)
                    };
                  } else {
                    return getWeapon(w);
                  }
                })
              }
                        
            return weapons.filter(({ usedBy }) => usedBy?.includes(unit.name))
        },
        getWeapon: ({ weapons }) => (weaponName: string) => weapons.find(({ name }) => name === weaponName),
        allWargearForUnit: ({ wargear, weapons }) => (unitName: string) => [
            ...weapons.filter(({ usedBy }) => usedBy?.includes(unitName)),
            ...wargear.filter(({ usedBy }) => usedBy?.includes(unitName))
        ]
    },

    actions: {
        initialise(dataUrl: string) {
            return api.get<Array<string>>(dataUrl)
                .then((factions) => {
                    factions.forEach((faction) => {
                        this.factions.push(faction);
                        api.get(`${faction}.json`)
                            .then((data) => {
                                this.$patch((state) => {
                                    // state.factions.push(faction);
                                    const { units, weapons, abilities, wargear } = data;

                                    if (abilities)
                                        state.abilities.push(...abilities.map((ability: Ability) => ({ ...ability, faction })));
                                    if (units)
                                        state.units.push(...units.map((unit: Unit) => ({ ...unit, faction })));
                                    if (weapons)
                                        state.weapons.push(...weapons.map((weapon: Weapon) => ({ ...weapon, faction })));
                                    if (wargear)
                                        state.wargear.push(...wargear.map((wargear: Wargear) => ({ ...wargear, faction })));
                                })
                            });
                    });
                });
        }
    }
})

