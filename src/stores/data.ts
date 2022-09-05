import { defineStore } from 'pinia';
import { mande } from 'mande';
import isArray from 'lodash/isArray';
import type {
  Faction,
  BaseUnit, Unit, SquadUnit,
  Ability, Wargear, Weapon, Configuration,
} from '@/types/unit';

interface State {
  factions: string[];
  abilities: Ability[];
  units: Unit[];
  wargear: Wargear[];
  weapons: Weapon[];
  configuration: Configuration[];
}

const api = mande('/');

function parseFaction(faction : string | [string, string]): { factionName: string; dataFile: string; } {
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
    wargear: [],
    weapons: [],
    configuration: [],
  }),

  getters: {
    getUnitsForFaction: (state) => (faction: string) => state.units.filter((unit: Unit) => unit.faction === faction),
    getWargear: ({ wargear }) => (wargearName: string) : Wargear | undefined => wargear.find(({ name }) => name === wargearName),
    getWargearForFaction: ({ wargear }) => (factionName: string) => wargear.filter(({ faction }) => faction === factionName),
    getWargearForUnit: ({ wargear }) => (unitName: string) => wargear.filter(({ usedBy }) => usedBy?.includes(unitName)),
    getWeapon: ({ weapons }) => (weaponName: string) : Weapon | undefined => weapons.find(({ name }) => name === weaponName),
    getWeaponsForFaction: (state) => (faction: string) => state.weapons.filter((weapon) => weapon.faction === faction),
    getWeaponsForUnit: ({ weapons, getWeapon, getWargear }) => (unit: SquadUnit) => weapons.filter(({ usedBy }) => usedBy?.includes(unit.name)),
    allWargearForUnit: ({ wargear, weapons }) => (unitName: string) => [
      ...weapons.filter(({ usedBy }) => usedBy?.includes(unitName)),
      ...wargear.filter(({ usedBy }) => usedBy?.includes(unitName)),
    ],

    getBuildOptionsForUnit: ({ units }) => ({ name } : SquadUnit) => {
      const unit = units.find((u) => u.name === name);
      return unit?.options ?? [];
    },

    getUnitByName: ({ units }) => (unitName: string) => units.find(({ name }) => name === unitName),

    getConfigurationOptionsForUnit: ({ configuration }) => ({ name }: BaseUnit) => configuration.filter(({ usedBy }) => usedBy.includes(name)),
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
                  // state.factions.push(faction);
                  const {
                    units, weapons, abilities, wargear, configuration,
                  } = data;

                  if (abilities) state.abilities.push(...abilities.map((ability: Ability) => ({ ...ability, faction: factionName })));
                  if (units) state.units.push(...units.map((unit: Unit) => ({ ...unit, faction: factionName })));
                  if (weapons) state.weapons.push(...weapons.map((weapon: Weapon) => ({ ...weapon, faction: factionName })));
                  if (wargear) state.wargear.push(...wargear.map((wargear: Wargear) => ({ ...wargear, faction: factionName })));
                  if (configuration) state.configuration.push(...configuration);
                });
              });
          });
        });
    },
  },
});
