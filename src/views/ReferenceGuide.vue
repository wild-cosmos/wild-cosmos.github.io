<template>
  <form class="mb-3">
    <div class="row align-items-center">
      <div class="col-12 col-sm-6 mb-3 mb-sm-0">
        <SelectFaction v-model:faction="selectedFaction" allow-null />
      </div>
      <div class="col-12 col-sm-6">
        <div class="form-floating">
          <input id="search" v-model="searchText" type="text" class="form-control" 
          placeholder="Search" aria-label="Search">
          <label for="search">Search</label>
        </div>
      </div>
    </div>
  </form>

  <div>
    <UnitList v-if="unitsMatchingFilter.length" :units="unitsMatchingFilter" :show-faction="!selectedFaction" />
    <WeaponsList v-if="weaponsMatchingFilter.length" :weapons="weaponsMatchingFilter"
      :show-faction="!selectedFaction" />
    <WargearList v-if="wargearMatchingFilter.length" :wargear="wargearMatchingFilter"
      :show-faction="!selectedFaction" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import SelectFaction from '@/components/SelectFaction.vue';
import UnitList from '@/components/UnitList.vue';
import { useDataStore } from '@/stores/data';
import WeaponsList from '../components/WeaponsList.vue';
import WargearList from '../components/WargearList.vue';
import isUndefined from 'lodash/isUndefined';

const props = defineProps<{
  faction?: string,
  q?: string
}>();

const router = useRouter();
const dataStore = useDataStore();

watch(props, async ({ faction, q }) => {
  if (!isUndefined(faction))
    dataStore.filter = { faction, q };
  else 
    doSearch(dataStore.filter);
}, { immediate: true })

const searchText = computed({
  get() { return dataStore.filter.q; },
  set(q) { doSearch({ ...dataStore.filter, q }); }
});

const selectedFaction = computed({
  get() { return dataStore.filter.faction; },
  set(faction) { doSearch({ ...dataStore.filter, faction }); }
});

function doSearch(query: { q: string | null, faction: string | null }) {
  router.push({ name: 'reference', query });
};

const searchFilter = (query: string | null) => {
  const test = query 
    ? new RegExp(
        query.split(' ')
             .filter(s => s > '')
             .map((s) => `${s}`)
             .join('|'), 'i') 
    : { test: () => true };
  return ({ name }: { name: string; }) => test.test(name);
};

const unitsMatchingFilter = computed(() => {
  const { q, faction } = dataStore.filter;

  if (!q && !faction) return [];
  const units = faction
    ? dataStore.getUnitsForFaction(faction)
    : dataStore.units;

  return units.filter(searchFilter(q));
});

const weaponsMatchingFilter = computed(() => {
  const { q, faction } = dataStore.filter;

  if (!q && !faction) return [];
  const weapons = faction
    ? dataStore.getWeaponsForFaction(faction)
    : dataStore.weapons;

  return weapons.filter(searchFilter(q));
});

const wargearMatchingFilter = computed(() => {
  const { q, faction } = dataStore.filter;

  if (!q && !faction) return [];
  const wargear = faction
    ? dataStore.getWargearForFaction(faction)
    : dataStore.wargear;

  return wargear.filter(searchFilter(q));
});
</script>
