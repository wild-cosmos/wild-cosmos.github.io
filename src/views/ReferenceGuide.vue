<template>
  <form class="mb-3">
    <div class="row">
      <div class="col-12 col-sm-6 mb-3 mb-sm-0">
        <div class="form-floating">
          <input id="search" v-model="search" type="text" class="form-control" aria-label="Search">
          <label for="search">Search</label>
        </div>
      </div>
      <div class="col">
        <SelectFaction v-model:faction="selectedFaction" allow-null />
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
import { computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import SelectFaction from '@/components/SelectFaction.vue';
import UnitList from '@/components/UnitList.vue';
import { useDataStore } from '@/stores/data';
import WeaponsList from '../components/WeaponsList.vue';
import WargearList from '../components/WargearList.vue';

defineProps<{
  faction?: string
}>();

const router = useRouter();
const dataStore = useDataStore();

const search = ref('');
const selectedFaction = ref(null);

const searchFilter = (query: string) => {
  const test = query ? new RegExp(query, 'i') : { test: () => true };
  return ({ name }: { name: string; }) => test.test(name);
};

watch(selectedFaction, async (faction) => {
  if (faction) {
    router.push({ name: 'reference', query: { faction } });
  }
});

const unitsMatchingFilter = computed(() => {
  if (!search.value && !selectedFaction.value) return [];
  const units = selectedFaction.value
    ? dataStore.getUnitsForFaction(selectedFaction.value)
    : dataStore.units;

  return units.filter(searchFilter(search.value));
});

const weaponsMatchingFilter = computed(() => {
  if (!search.value && !selectedFaction.value) return [];
  const weapons = selectedFaction.value
    ? dataStore.getWeaponsForFaction(selectedFaction.value)
    : dataStore.weapons;

  return weapons.filter(searchFilter(search.value));
});

const wargearMatchingFilter = computed(() => {
  if (!search.value && !selectedFaction.value) return [];
  const wargear = selectedFaction.value
    ? dataStore.getWargearForFaction(selectedFaction.value)
    : dataStore.wargear;

  return wargear.filter(searchFilter(search.value));
});
</script>
