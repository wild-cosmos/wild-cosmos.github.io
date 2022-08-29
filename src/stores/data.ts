import { defineStore } from 'pinia'
import { mande } from 'mande'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject';

interface State {
     factions: Array<string>;
     abilities: Array<Ability>;
     units: Array<Unit>;
     wargear: Array<Wargear>;
     weapons: Array<Weapon>;
 }

const api = mande('/');

export const useDataStore = defineStore({
    id: 'data',

    state: () : State => ({
        factions: [],
        abilities: [],
        units: [],
        wargear: [],
        weapons: [],
    }),

    getters: {
        getUnitsForFaction: (state) => (faction: string) => state.units.filter((unit: Unit) => unit.faction === faction),
        getWargear: ({ wargear }) => (wargearName: string) => wargear.find(({ name }) => name === wargearName),
        getWargearForUnit: ({ wargear }) => (unitName: string) => wargear.filter(({ usedBy }) => usedBy?.includes(unitName)),
        getWeapon: ({ weapons }) => (weaponName: string) => weapons.find(({ name }) => name === weaponName),
        getWeaponsForUnit: ({ weapons, getWeapon, getWargear }) => (unit: Unit) => {
            if (unit.weapons) {
                return unit.weapons.map((w: string) => {
                  if (isArray(w)) {
                    const { name, cost } = w.map((name) => getWeapon(name) || getWargear(name))
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
                        const { factionName, dataFile } = parseFaction(faction);

                        this.factions.push(factionName);
                        api.get<Faction>(dataFile)
                            .then((data) => {
                                this.$patch((state) => {
                                    // state.factions.push(faction);
                                    const { units, weapons, abilities, wargear } = data;

                                    if (abilities)
                                        state.abilities.push(...abilities.map((ability: Ability) => ({ ...ability, faction: factionName })));
                                    if (units)
                                        state.units.push(...units.map((unit: Unit) => ({ ...unit, faction: factionName })));
                                    if (weapons)
                                        state.weapons.push(...weapons.map((weapon: Weapon) => ({ ...weapon, faction: factionName })));
                                    if (wargear)
                                        state.wargear.push(...wargear.map((wargear: Wargear) => ({ ...wargear, faction: factionName })));
                                })
                            });
                    });
                });
        }
    }
})

function parseFaction(faction : string | [string, string]): { factionName: string; dataFile: string; } {
    if (isArray(faction)) {
        const [factionName, dataFile] = faction;
        return { factionName, dataFile }
    }

    return {
        factionName: faction,
        dataFile: `${faction}.json`
    }
}

