<template>
  <div v-for="{ name, wargear, weapons } in enabledWargearList" :key="name" class="card mt-2">
    <div class="card-header">
      {{ name }}
    </div>
    <div class="card-body">
      <div class="button-bar">
        <button v-for="item in wargear" :key="item.name" type="button"
          :class="['btn btn-sm', item.available ? 'btn-outline-primary' : 'btn-outline-secondary', 'text-nowrap']"
          :disabled="!item.available" @click="onSelect(item)">
          {{ item.name }} ({{ item.cost }})
        </button>
        <button v-for="item in weapons" :key="item.name" type="button"
          :class="['btn btn-sm', item.available ? 'btn-outline-primary' : 'btn-outline-secondary', 'text-nowrap']"
          :disabled="!item.available" @click="onSelect(item)">
          {{ item.name }} ({{ item.cost }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isArray, isString } from 'lodash-es';
import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';
import type {
  SquadUnit, Unit, Wargear, Weapon,
} from '@/types/unit';
import type { Condition } from '@/types/faction';

const props = defineProps<{ unit: SquadUnit }>();

const dataStore = useDataStore();
const squadStore = useSquadStore();

const getLimitedWargear = ({ limit, modelLimit, warbandLimit }: { limit?: number, modelLimit?: number, warbandLimit?: number }) => ({ weapons, wargear }: { weapons: Weapon[], wargear: Wargear[] }) => {
  if (limit) {
    return [
      ...weapons.filter((w) => (limit && w.limit === limit)).map(({ name }) => name),
      ...wargear.filter((w) => (limit && w.limit === limit)).map(({ name }) => name),
    ];
  }
  if (modelLimit) {
    return [
      ...weapons.filter((w) => (modelLimit && w.modelLimit === modelLimit)).map(({ name }) => name),
      ...wargear.filter((w) => (modelLimit && w.modelLimit === modelLimit)).map(({ name }) => name),
    ];
  }
  if (warbandLimit) {
    return [
      ...weapons.filter((w) => (warbandLimit && w.warbandLimit)).map(({ name }) => name),
      ...wargear.filter((w) => (warbandLimit && w.warbandLimit === warbandLimit)).map(({ name }) => name),
    ];
  }
  return [];
};

const wargearList = computed(() => dataStore.getWargearListForModel(props.unit).filter(({ wargear, weapons }) => wargear?.length || weapons?.length));

const makeItemFilter = (model, wargearList) => {
  const isModelTypeMatch = ({ only }: Condition) => !only || only.includes(model.name);

  const hasAbility = ({ ability }: Wargear & Condition) => {
    if (!ability) return true;
    if (isString(ability) && model.abilities?.some((name) => name.startsWith(ability))) return true;
    return model.abilities?.some((name) => ability.some((a) => name.startsWith(a)));
  };
  const isExcluded = ({ not }: Condition) => {
    if (!not) return false;
    return (not.ability && hasAbility(not)) || (not.role && hasRoleOrType(not));
  };

  const hasRoleOrType = ({ role }: Condition) => !role
    || role.includes(model.role)
    || (isArray(role) && role.reduce((isType, type) => isType || model.type.includes(type), false));
  const isEquiped = ({ name }: Wargear & Condition) => model.wargear.find((item) => item.name === name)
    || model.weapons.find((item) => item.name === name);
  const hasRequired = ({ requires }: Condition) => !requires
    || requires.reduce((equipped, itemName) => equipped || model.weapons?.some(({ name }) => name === itemName), false)
    || requires.reduce((equipped, itemName) => equipped || model.wargear?.some(({ name }) => name === itemName), false);
  const hasAny = ({ any }: Condition) => !any
    || any.reduce((equipped, itemName) => equipped || model.weapons?.some(({ name }) => name.startsWith(itemName)), false);
  const isNotLimited = ({
    name, limit, modelLimit, warbandLimit,
  }: Wargear & Condition) => {
    if (limit) {
      // No more than one model in your warband can take this item
      if (squadStore.getWargearCountInWarband[name] > 0) return false;
    }
    if (modelLimit) {
      // A model cannot take more than one of these items
      const limitedItems = wargearList.flatMap(getLimitedWargear({ modelLimit }));

      if (limitedItems.reduce(
        (hasItem, itemName) => hasItem || model.weapons.some((w) => w.name === itemName) || model.wargear.some((w) => w.name === itemName),
        false,
      )) return false;
    }
    if (warbandLimit) {
      // Your warband cannot include more than one of these items
      const limitedItems = wargearList.flatMap(getLimitedWargear({ warbandLimit }));
      const itemCount: number[] = limitedItems.map((itemName: string) => squadStore.getWargearCountInWarband[itemName] ?? 0);
      if (itemCount.some((n) => n > 0)) return false;
    }
    return true;
  };

  return (item: Wargear & Condition): boolean => isModelTypeMatch(item)
    && hasRoleOrType(item)
    && hasAbility(item)
    && hasRequired(item)
    && hasAny(item)
    && (item.multiple || !isEquiped(item))
    && !isExcluded(item)
    && isNotLimited(item);
};

const enabledWargearList = computed(() => {
  const itemFilter = makeItemFilter(props.unit, wargearList.value);
  return wargearList.value.map(({ name, wargear, weapons }) => ({
    name,
    weapons: weapons?.map((item) => ({ ...item, available: itemFilter(item) })),
    wargear: wargear?.map((item) => ({ ...item, available: itemFilter(item) })),
  }));
});
// const activeWargear = (items : Wargear[] | Weapon[]) => {
//   if (!items) return [];
//   items.map((item) => ({ ...item, available: itemFilter(item) }));
// };

function onSelect({ name, cost, replaces }: Wargear & Condition) {
  if (replaces) squadStore.removeWargear(props.unit, replaces);
  squadStore.addWargear(props.unit, name, cost);
}
</script>
