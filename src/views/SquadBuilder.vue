<template>
  <div class="container-fluid">
    <div class="bg-light mb-3 p-2">
      <SelectFaction v-model:faction="selectedFaction" />
    </div>

    <SquadMember v-for="(unit) in squadStore.units" :key="unit.id" :unit="unit">
      <button class="btn btn-success" @click="squadStore.addSquadMember">
        Add</button>
      <button class="btn btn-success" @click="squadStore.duplicateSquadMember(unit)">Duplicate</button>
      <button class="btn btn-success" @click="squadStore.removeSquadMember(unit)">Remove</button>
    </SquadMember>

    <div class="row py-2">
      <div class="col-4">&nbsp;</div>
      <div class="col">&nbsp;</div>
      <div class="col-1">
        <strong class="text-nowrap">{{ squadStore.totalPoints }} Pts</strong>
      </div>
    </div>

    <div class="bg-light my-3 p-2">
      <button class="btn btn-success" @click="squadStore.addSquadMember">Add Unit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SquadMember from '@/components/SquadMember.vue';
import SelectFaction from '@/components/SelectFaction.vue';

import { computed, reactive, watch } from 'vue';
import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';

const dataStore = useDataStore();
const squadStore = useSquadStore();

// const state = reactive({ selectedFaction: null as any});

const selectedFaction = computed({
  get() { return squadStore.faction; },
  set(faction) { squadStore.faction = faction; }
});

// watch(state.selectedFaction, (faction) => {
//   if (faction) squadStore.faction = faction;
// })
</script>

<style scoped>
</style>