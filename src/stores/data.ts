import { defineStore } from 'pinia';
import { mande } from 'mande';
import { isArray, isString, uniq } from 'lodash-es';

import type {
  BaseUnit, Unit, SquadUnit,
  Wargear, Weapon, Item,
} from '@/types/unit';
import type { Ability, Configuration, Faction } from '@/types/faction';

interface State {
  factions: string[];
  subFactions: { [key : string] : string[] };
  abilities: Ability[];
  models: Unit[];
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

export const useDataStore = defineStore({
  id: 'data',

  state: () : State => ({
    factions: [],
    subFactions: {},
    abilities: [],
    models: [],
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
    getUniqueFactions: (state) => state.models.reduce((factionList, { faction, factionName }) => {
      if (isArray(faction)) {
        faction.forEach((f) => {
          if (!factionList.includes(f)) factionList.push(f);
        });
      } else if (factionName && !factionList.includes(factionName)) {
        factionList.push(factionName);
      }
      return factionList;
    }, [] as string[]),
    getModelsForFaction: (state) => (lookupName: string) => state.models.filter(({ faction, factionName }) => factionName === lookupName || faction?.includes(lookupName)),
    getAbilitiesForFaction: (state) => (lookupName: string) => state.abilities.filter(({ faction, factionName }) => factionName === lookupName || faction?.includes(lookupName)),
    getWargear: (state) => (wargearName: string) : Wargear | undefined => state.wargear.find(({ name }) => name === wargearName),
    getWargearForFaction() {
      return (factionName: string) => {
        const searchFactions = this.getSearchFactions(factionName);
        return this.wargear.filter(({ faction }) => searchFactions.includes(faction));
      };
    },

    getWeapon: (state) => (weaponName: string) : Weapon | undefined => state.weapons.find(({ name }) => name === weaponName),
    getWeaponsForFaction() {
      return (factionName: string) => {
        const searchFactions = this.getSearchFactions(factionName);
        return this.weapons.filter(({ faction }) => searchFactions.includes(faction));
      };
    },
    getSearchFactions: (state) => (factionName : string) => {
      const searchFactions = Object.entries(state.subFactions).filter(([, list]) => list.includes(factionName)).map(([f]) => f);
      return searchFactions.length ? uniq(searchFactions) : [factionName];
    },

    getModelByName: (state) => (unitName: string) => state.models.find(({ name }) => name === unitName),

    getConfigurationOptionsForModel: (state) => ({ name }: BaseUnit) => state.configuration.filter(({ usedBy }) => usedBy.includes(name)),

    getWargearListForModel: (state) => ({ name } : SquadUnit) : { name: string, weapons: Weapon[], wargear: Wargear[] }[] => {
      const unit = state.models.find((u) => u.name === name);
      return unit?.wargearList?.map((listName) => ({ name: listName, ...state.wargearList[listName] })) ?? [];
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
                  if (data.abilities?.length > 0) {
                    state.abilities.push(...data.abilities.map((name) => ({ name, factionName })));
                  }

                  if (data.models) {
                    const modelList = Object.entries(data.models)
                      .map<Unit>(([name, model]) => Object.assign(model, { name, factionName, faction: model.faction || [factionName] }));

                    state.subFactions[factionName] = modelList.reduce((f, model) => {
                      model.faction?.forEach((s) => {
                        if (!f.includes(s)) f.push(s);
                      });
                      return f;
                    }, [] as string[]);

                    state.models.push(...modelList);
                  }

                  if (data.weapons) {
                    if (isArray(data.weapons)) {
                      state.weapons.push(...data.weapons.map((item) => Object.assign(item, { faction: factionName })));
                    } else {
                      const weaponsArray = Object.entries<Weapon>(data.weapons)
                        .map<Weapon>(([name, item]) => Object.assign(item, { name, faction: factionName }));
                      state.weapons.push(...weaponsArray);
                    }
                  }

                  if (data.wargear) {
                    if (isArray(data.wargear)) {
                      state.wargear.push(...data.wargear.map((item) => Object.assign(item, { faction: factionName })));
                    } else {
                      const wargearArray = Object.entries<Wargear>(data.wargear)
                        .map(([name, item]) => Object.assign(item, { name, faction: factionName }));
                      state.wargear.push(...wargearArray);
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
          })        
        })
    },

    loadHtml() {
      this.abilities.forEach((ability) => {
        console.log(`Loading /rules/abilities/${ability.name}.html`);
        api.get(`rules/abilities/${ability.name}.html`, { headers: {
          Accept: 'text/html' } })
          .then((description) => {
            debugger;
            return Object.assign(ability, { description });
          })
          .catch((error) => { console.log(error); });
        });
    },

    getAbility(ability: Ability) {
      if (ability?.description) return ability;

      const filename = ability.name.replace(/\([0-9+]+\)/, '').trim();

      // const suffixOffset = filename.lastIndexOf('(');
      // if (suffixOffset > -1) filename = filename.slice(0, suffixOffset).trim();

      return api.get<string>(`rules/abilities/${filename}.html`, { headers: {
        Accept: 'text/html' }, responseAs: 'text' })
        .then((description) => Object.assign(ability, { description }));
    },
  }
});
