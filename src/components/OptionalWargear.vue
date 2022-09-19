<template>
  <div class="card mt-2" v-for="{ name, wargear, weapons } in enabledWargearList" :key="name">
    <div class="card-header">{{ name }}</div>
    <div class="card-body">
      <div class="button-bar">
        <button v-for="item in wargear" :key="item.name"
        :class="[ 'btn btn-sm', item.available ? 'btn-outline-primary' : 'btn-outline-secondary', 'text-nowrap' ]"
          :disabled="!item.available" @click="onSelect(item)">
          {{ item.name }} ({{ item.cost }})
        </button>
        <button v-for="item in weapons" :key="item.name" 
          :class="[ 'btn btn-sm', item.available ? 'btn-outline-primary' : 'btn-outline-secondary', 'text-nowrap' ]"
          :disabled="!item.available" @click="onSelect(item)">
          {{ item.name }} ({{ item.cost }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Condition, SquadUnit, Wargear, Weapon } from '@/types/unit';
import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';
import { computed } from 'vue';
import { isArray, isString } from 'lodash-es';

const props = defineProps<{ unit: SquadUnit }>();

const dataStore = useDataStore();
const squadStore = useSquadStore();

const itemFilter = ((model) => {
  const isModelTypeMatch = ({ only } : Condition) => !only || only.includes(model.name);
  const isExcluded = ({ not }) => {
    if (!not) return false;
    return (not.ability && hasAbility(not))
      || (not.role && hasRoleOrType(not));
  }
  const isNotExcluded = ({ not } : Condition) => !not || !not.includes(model.name);
  const hasAbility = ({ name, ability } : Wargear & Condition) => {
    console.log(model.name, model.abilities, name, ability)
    if (!ability) return true;
    if (isString(ability) && model.abilities?.some((abilityName) => abilityName.startsWith(ability))) return true;
    return model.abilities?.some((abilityName) => ability.some((a) => abilityName.startsWith(a)));
  };
  const hasRoleOrType = ({ role } : Condition) => !role 
  || role.includes(model.role) 
  || (isArray(role) && role.reduce((isType, type) => isType || model.type.includes(type), false));
  const isNotEquiped = ({ name } : Wargear & Condition) => !model.wargear.find((item) => item.name === name);
  const hasRequired = ({ requires } : Condition) => !requires 
    || requires.reduce((equipped, itemName) => equipped || model.weapons?.some(({name})=> name === itemName), false)
    || requires.reduce((equipped, itemName) => equipped || model.wargear?.some(({name})=> name === itemName), false);
  const hasAny = ({ any } : Condition) => !any 
    || any.reduce((equipped, itemName) => equipped || model.weapons?.some(({ name }) => name.startsWith(itemName)), false);
  const isNotLimited = ({ name, limit, modelLimit, warbandLimit } : Wargear & Condition) => {
    if (limit) {
      const n = model.weapons.filter((w) => w.name === name).length
        + model.wargear.filter((w) => w.name === name).length;

      if (n >= limit) return false;
    }
    if (modelLimit) {
      const n = squadStore.getModelsWithItem(name)?.length ?? 0;
      if (n >= modelLimit) return false;
    }
    if (warbandLimit) {
      const n = squadStore.getWargearCountInWarband[name] ?? 0;
      if (n >= warbandLimit) return false;
    }
    return true;
  }
  
  return (item : Wargear & Condition) : boolean => isModelTypeMatch(item)
    && hasRoleOrType(item)
    && hasAbility(item)
    && hasRequired(item)
    && hasAny(item)
    && !isExcluded(item)
    && isNotEquiped(item)
    && isNotLimited(item);
})(props.unit);

const wargearList = computed(() => dataStore.getWargearListForUnit(props.unit).filter(({ wargear, weapons }) => wargear?.length || weapons?.length ));

const enabledWargearList = computed(() => wargearList.value.map(({ name, wargear, weapons }) => ({
  name, 
  weapons: weapons?.map((item) => ({ ...item, available: itemFilter(item) })),
  wargear: wargear?.map((item) => ({ ...item, available: itemFilter(item) })),
})));
// const activeWargear = (items : Wargear[] | Weapon[]) => {
//   if (!items) return [];
//   items.map((item) => ({ ...item, available: itemFilter(item) }));
// };

function onSelect({ name, cost, replaces } : Wargear & Condition) {
  if (replaces) squadStore.removeWargear(props.unit, replaces);
  squadStore.addWargear(props.unit, name, cost)
}
</script>