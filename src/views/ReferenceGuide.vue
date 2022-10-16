<template>
  <form class="mb-3">
    <div class="row align-items-center">
      <div class="col-12 col-sm-6 mb-3 mb-sm-0">
        <SelectFaction v-model:faction="selectedFaction" allow-null />
      </div>
      <div class="col-12 col-sm-6">
        <div class="form-floating">
          <input id="search" v-model="searchText" type="text" class="form-control" placeholder="Search"
            aria-label="Search">
          <label for="search">Search</label>
        </div>
      </div>
    </div>
  </form>

  <div>
    <UnitList v-if="modelsMatchingFilter.length" :models="modelsMatchingFilter" :show-faction="!selectedFaction" />

    <div v-for="{ faction, items } in weaponsByFaction" :key="faction">
      <h3>Weapons: {{ faction }}</h3>
      <WeaponsList :weapons="items" />
    </div>

    <div v-for="{ faction, items } in wargearByFaction" :key="faction">
      <h3>Wargear: {{ faction }}</h3>
      <WargearList :wargear="items" />
    </div>

    <div v-for="{ faction, items } in abilitiesByFaction" :key="faction">
      <h3>Abilities: {{ faction }}</h3>
      <AbilityList :items="items" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { isUndefined, orderBy } from 'lodash-es';
import SelectFaction from '@/components/SelectFaction.vue';
import UnitList from '@/components/UnitList.vue';
import { useDataStore } from '@/stores/data';
import AbilityList from '../components/AbilityList.vue'
import WeaponsList from '../components/WeaponsList.vue';
import WargearList from '../components/WargearList.vue';
import type { Item, Wargear, Weapon } from '@/types/unit';
import type { Ability } from '@/types/faction';

function groupByFaction<T extends Item>(items: Wargear[]): { faction: string, items: T[] }[] {
  const groupedItems = items.reduce((groupedList, item) => {
    if (item.faction in groupedList) {
      groupedList[item.faction].push(item as T);
    } else {
      groupedList[item.faction] = [item as T];
    }
    return groupedList;
  }, {} as { [key: string]: T[] });

  return orderBy(Object.entries(groupedItems).map(([faction, items]) => ({ faction, items })), ['faction']);
}

const props = defineProps<{
  faction?: string,
  q?: string
}>();

const router = useRouter();
const dataStore = useDataStore();

watch(props, async ({ faction, q }) => {
  if (!isUndefined(faction)) dataStore.filter = { faction, q };
  else doSearch(dataStore.filter);
}, { immediate: true });

const searchText = computed({
  get() { return dataStore.filter.q; },
  set(q) { doSearch({ ...dataStore.filter, q }); },
});

const selectedFaction = computed({
  get() { return dataStore.filter.faction; },
  set(faction) { doSearch({ ...dataStore.filter, faction }); },
});

function doSearch(query: { q: string | null, faction: string | null }) {
  router.push({ name: 'reference', query });
}

const searchFilter = (query: string | null) => {
  const test = query
    ? new RegExp(query.split(' ')
      .filter((s) => s > '')
      .map((s) => `${s}`)
      .join('|'), 'i')
    : { test: () => true };
  return ({ name }: { name: string; }) => test.test(name);
};

const modelsMatchingFilter = computed(() => {
  const { q, faction } = dataStore.filter;

  if (!q && !faction) return [];
  const models = faction
    ? dataStore.getModelsForFaction(faction)
    : dataStore.models;

  return models.filter(searchFilter(q));
});

const abilitiesMatchingFilter = computed(() => {
  const { q, faction } = dataStore.filter;

  if (!q && !faction) return [];

  const abilities = faction
    ? dataStore.getAbilitiesForFaction(faction)
    : dataStore.abilities;

  return abilities.filter(searchFilter(q));
});

const abilitiesByFaction = computed(() => groupByFaction<Ability>(abilitiesMatchingFilter.value));

const weaponsMatchingFilter = computed(() => {
  const { q, faction } = dataStore.filter;

  if (!q && !faction) return [];
  const weapons = faction
    ? dataStore.getWeaponsForFaction(faction)
    : dataStore.weapons;

  return weapons.filter(searchFilter(q));
});

const weaponsByFaction = computed(() => groupByFaction<Weapon>(weaponsMatchingFilter.value));

const wargearMatchingFilter = computed(() => {
  const { q, faction } = dataStore.filter;

  if (!q && !faction) return [];
  const wargear = faction
    ? dataStore.getWargearForFaction(faction)
    : dataStore.wargear;

  return wargear.filter(searchFilter(q));
});

const wargearByFaction = computed(() => groupByFaction<Wargear>(wargearMatchingFilter.value));
</script>
