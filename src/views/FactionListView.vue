<template>
  <form class="mb-3">
    <div class="row">
      <div class="col">
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
  
  <UnitList v-if="unitsMatchingFilter.length" :units="unitsMatchingFilter" :show-faction="!selectedFaction" />
  <WeaponsList v-if="weaponsMatchingFilter.length" :weapons="weaponsMatchingFilter" :show-faction="!selectedFaction" />
</template>

<script setup lang="ts">
import SelectFaction from '@/components/SelectFaction.vue';
import UnitList from '@/components/UnitList.vue';
import { useDataStore } from '@/stores/data';
import { computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router'
import WeaponsList from '../components/WeaponsList.vue'

defineProps<{
  faction?: string
}>()

const router = useRouter();
const dataStore = useDataStore();

// const state = reactive({
//   selectedFaction: '',
//   search: ''
// });

const search = ref('');
const selectedFaction = ref(null);

const searchFilter = (query: string) => {
  const test = query ? new RegExp(query, 'i') : { test: () => true };
  return ({ name }) => test.test(name);
} 

watch(selectedFaction, async (faction) => {
  if (faction) {
    router.push({ name: 'faction', query: { faction } });
  }
});

const unitsMatchingFilter = computed(() => {
  if (!search.value && !selectedFaction.value) return [];
  const units = selectedFaction.value 
    ? dataStore.getUnitsForFaction(selectedFaction.value)
    : dataStore.units
  
  return units.filter(searchFilter(search.value))
})

const weaponsMatchingFilter = computed(()=> {
  if (!search.value && !selectedFaction.value) return [];
  const weapons = selectedFaction.value 
    ? dataStore.getWeaponsForFaction(selectedFaction.value)
    : dataStore.weapons

  return weapons.filter(searchFilter(search.value))
});

</script>
