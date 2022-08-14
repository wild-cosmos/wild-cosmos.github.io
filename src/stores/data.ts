import { defineStore } from 'pinia'
import { mande } from 'mande'

interface Unit {
    faction: string;
    name: string;
    cost: number;
  }

  interface Upgrade {
    type: string;
    name: string;
    cost: number;
  }

  interface Faction {
    units: Array<Unit>,
    upgrades: Array<Upgrade>
  }

  interface State {
    factions: Array<string>,
    units: Array<Unit>,
    upgrades: Array<Upgrade>
  }

  const api = mande('/');

export const useDataStore = defineStore({
    id: 'data',
    
    state: () => ({
        factions: [] as Array<string>,
        units: [] as Array<Unit>,
        upgrades: [] as Array<Upgrade>
    }),

    getters: {
        getUnitsForFaction: (state) => (faction: string) => state.units.filter((unit: Unit) => unit.faction === faction)
    },

    actions: {
        initialise(dataUrl: string) {
            console.log(dataUrl)
            api.get<any>(dataUrl)
            .then((data) => {
                this.$patch((state:State) => {
                    Object.keys(data).forEach((faction: string) => {
                        state.factions.push(faction);
                        if(data[faction]) {
                            const { units, upgrades } = data[faction]
                        
                            if (units)
                        state.units.push(units.map((unit: Unit) => ({ ...unit, faction })));
                }})
                })
            })
        }
    }
})
