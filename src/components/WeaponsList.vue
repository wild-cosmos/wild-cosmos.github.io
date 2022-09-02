<template>
  <div class="table-responsive">
    <table class="table table-hover table-sm">
      <thead class="table-secondary">
        <tr>
          <th>&nbsp;</th>
          <th>Rng</th>
          <th>A</th>
          <th>AP</th>
          <th>Dm</th>
          <th style="width: 40%">
            Types and Abilities
          </th>
        </tr>
      </thead>
      <tbody>
        <WeaponRow v-for="(weapon) in factionWeapons" :key="weapon.name" :weapon="weapon" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import WeaponRow from './WeaponRow.vue';
import { useDataStore } from '@/stores/data';
import { computed } from 'vue';
import orderBy from 'lodash/orderBy';

const props = defineProps<{
  faction: string
}>();

const dataStore = useDataStore();

const factionWeapons = computed(() => {
  return orderBy(dataStore.getWeaponsForFaction(props.faction), ['name']);
})

</script>