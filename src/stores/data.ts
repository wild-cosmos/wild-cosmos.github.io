import { defineStore } from 'pinia';
import { mande } from 'mande';
import { assign, isArray, isString } from 'lodash-es';

import type {
  Faction,
  BaseUnit, Unit, SquadUnit,
  Ability, Wargear, Weapon,
  Configuration, Item, Condition,
} from '@/types/unit';

interface State {
  factions: string[];
  abilities: Ability[];
  units: Unit[];
  wargear: Wargear[];
  weapons: Weapon[];
  wargearList: { [key : string ]: { weapons: Weapon[], wargear: Wargear[] } };
  configuration: Configuration[];
  filter: {
    faction: string | null,
    q: string | null
  }
}

const api = mande('/');

function makeArray(items?: string | string[] | null) {
  if (!items) return null;
  if (isArray(items)) return items;
  return [items];
}

function checkArrays<T extends { [key:string]: any | null }>(item? : T) {
  if (!item) return null;

  const result = {} as { [key:string]: any | null };

  Object.entries(item).forEach(([key, value]) => {
    switch (key) {
      case 'ability':
      case 'role':
      case 'any':
      case 'not':
      case 'only':
      case 'replaces':
      case 'requires':
      case 'usedBy':
        result[key] = isString(value) ? makeArray(value) : value;
        break;

      default:
        result[key] = value;
        break;
    }
  });

  return result;
}

function findItem(itemName : string, items? : Item[] | { [key : string]: Item }) {
  if (!items) return null;
  if (isArray(items)) return items.find(({ name }) => name === itemName);
  return items[itemName];
}

function parseFaction(faction : string | [string, string]) {
  if (isArray(faction)) {
    const [factionName, dataFile] = faction;
    return { factionName, dataFile };
  }

  return {
    factionName: faction,
    dataFile: `${faction}.json`,
  };
}

// eslint-disable-next-line import/prefer-default-export
export const useDataStore = defineStore({
  id: 'data',

  state: () : State => ({
    factions: [],
    abilities: [],
    units: [],
    wargear: [
      { name: 'Empty', hidden: true } as Wargear,
    ],
    weapons: [
      { name: 'Empty', hidden: true } as Weapon,
    ],
    wargearList: {},
    configuration: [],
    filter: {
      faction: null,
      q: null,
    },
  }),

  getters: {
    getUniqueFactions: ({ units }) => units.reduce((factionList, { faction }) => {
      if (isArray(faction)) {
        faction.forEach((f) => {
          if (!factionList.includes(f)) factionList.push(f);
        });
      } else if (!factionList.includes(faction)) {
        factionList.push(faction);
      }
      return factionList;
    }, [] as string[]),
    getUnitsForFaction: ({ units }) => (factionName: string) => units.filter(({ faction }) => faction === factionName || faction.includes(factionName)),
    getWargear: ({ wargear }) => (wargearName: string) : Wargear | undefined => wargear.find(({ name }) => name === wargearName),
    getWargearForFaction: ({ wargear }) => (factionName: string) => wargear.filter(({ faction }) => faction === factionName),
    getWeapon: ({ weapons }) => (weaponName: string) : Weapon | undefined => weapons.find(({ name }) => name === weaponName),
    getWeaponsForFaction: (state) => (faction: string) => state.weapons.filter((weapon) => weapon.faction === faction),

    getUnitByName: ({ units }) => (unitName: string) => units.find(({ name }) => name === unitName),

    getConfigurationOptionsForUnit: ({ configuration }) => ({ name }: BaseUnit) => configuration.filter(({ usedBy }) => usedBy.includes(name)),

    getWargearListForUnit: ({ units, wargearList }) => ({ name } : SquadUnit) : { name: string, weapons: Weapon[], wargear: Wargear[] }[] => {
      const unit = units.find((u) => u.name === name);
      return unit?.wargearList?.map((listName) => ({ name: listName, ...wargearList[listName] })) ?? [];
    },
  },

  actions: {
    initialise(dataUrl: string) {
      return api.get<string[]>(dataUrl)
        .then((factions) => {
          factions.forEach((faction) => {
            const { factionName, dataFile } = parseFaction(faction);
            this.factions.push(factionName);

            api.get<Faction>(dataFile)
              .then((data) => {
                this.$patch((state) => {
                  if (data.abilities) {
                    state.abilities.push(...data.abilities.map((ability: Ability) => ({
                      ...ability,
                      faction: factionName,
                    })));
                  }
                  if (data.models) {
                    const modelList = Object.entries(data.models)
                      .map(([name, model]) => Object.assign(model, { name, faction: /* model.faction || */ factionName }));
                    state.units.push(...modelList);
                  }
                  if (data.weapons) {
                    if (isArray(data.weapons)) {
                      state.weapons.push(...data.weapons.map((item) => Object.assign(item, { faction: factionName })));
                    } else {
                      state.weapons.push(...Object.entries(data.weapons).map(([name, item]) => Object.assign(item, { name, faction: factionName })));
                    }
                  }
                  if (data.wargear) {
                    if (isArray(data.wargear)) {
                      state.wargear.push(...data.wargear.map((item) => Object.assign(item, { faction: factionName })));
                    } else {
                      state.wargear.push(...Object.entries<{ [key:string]:Wargear }>(data.wargear).map(([name, item]) => ({
                        name,
                        faction: factionName,
                        ...item,
                      })));
                    }
                  }

                  if (data.wargearList) {
                    Object.entries(data.wargearList)
                      .map(([listName, listItems]) => ({
                        name: listName,
                        weapons: Object.entries(listItems)
                          .map(([itemName, options]) => {
                            const weaponItem = findItem(itemName, data.weapons);

                            if (weaponItem) {
                              return {
                                ...weaponItem,
                                ...options,
                                name: itemName,
                              };
                            }

                            return null;
                          })
                          .filter((w) => !!w)
                          .map(checkArrays),
                        wargear: Object.entries(listItems)
                          .map(([itemName, options]) => {
                            const wargearItem = findItem(itemName, data.wargear);
                            if (wargearItem) {
                              return {
                                ...wargearItem,
                                ...options,
                                name: itemName,
                              };
                            }
                            return null;
                          })
                          .filter((w) => !!w)
                          .map((w) => checkArrays(w)),
                      }))
                      .forEach(({ name, weapons, wargear }) => {
                        Object.assign(state.wargearList, { [name]: { weapons, wargear } });
                        // state.wargearList[wargearList.name] = { weapons, wargear };
                      });
                  }
                  if (data.configuration) {
                    const normalisedConfiguration = data.configuration.map<Configuration>((c) => ({
                      ...checkArrays(c),
                      condition: checkArrays(c.condition),
                    }));
                    // state.configuration.push(...data.configuration.map((c) => ({
                    //   ...checkArrays(c),
                    //   condition: checkArrays(c.condition),
                    // })));

                    state.configuration.push(...normalisedConfiguration);
                  }
                });
              })
              .catch((error) => {
                console.error(`Error processing ${dataFile}`, error);
              });
          });
        });
    },
  },
});
