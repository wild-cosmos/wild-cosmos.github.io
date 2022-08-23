<template>
  <div class="container-fluid">
    <div class="bg-light mb-3 p-3">
      <SelectFaction v-model:faction="selectedFaction" class="mb-3" />
      <div class="form-floating">
        <input v-model="squadName" class="form-control">
        <label for="selectWeapon">Squad Name</label>
      </div>
    </div>


    <SquadMember v-for="(unit) in squadStore.units" :key="unit.id" :unit="unit">
      <button class="btn btn-success" @click="squadStore.duplicateSquadMember(unit)">Duplicate</button>
      <button class="btn btn-danger" @click="squadStore.removeSquadMember(unit)">Remove</button>
    </SquadMember>

    <div class="row py-2">
      <div class="col-4">&nbsp;</div>
      <div class="col">&nbsp;</div>
      <div class="col-1">
        <strong class="text-nowrap">Total {{ squadStore.totalPoints }} Pts</strong>
      </div>
    </div>

    <div class="d-print-none bg-light my-3 p-2">
      <div class="form-floating">
        <select id="selectUnit" v-model="selectedUnit" class="form-control">
          <option v-for="({ value, text }) in availableUnitOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectUnit">Unit</label>
      </div>
      <button class="mt-2 btn btn-success" :disabled="!selectedUnit" @click="onAddSquadMember">
        Add Unit to Roster
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SquadMember from '@/components/SquadMember.vue';
import SelectFaction from '@/components/SelectFaction.vue';

import { computed, ref } from 'vue';
import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';

import orderBy from 'lodash/orderBy'

const dataStore = useDataStore();
const squadStore = useSquadStore();

// const state = reactive({ selectedFaction: null as any});

const selectedFaction = computed({
  get() { return squadStore.faction; },
  set(faction) { squadStore.faction = faction; }
});

const squadName = ref("")
const selectedUnit = ref(null)

const availableUnits = computed(() => {
  return dataStore.getUnitsForFaction(squadStore.faction);
})

const availableUnitOptions = computed(() => {
  const options = availableUnits.value.map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }))
  return orderBy(options, ['text']);
})

function onAddSquadMember() {
  const unit = availableUnits.value.find(({ name }) => name === selectedUnit.value)
  if (unit) squadStore.addSquadMember(unit);
}

// watch(state.selectedFaction, (faction) => {
//   if (faction) squadStore.faction = faction;
// })
</script>

<style scoped>
</style>