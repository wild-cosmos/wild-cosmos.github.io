<script setup lang="ts">
import UnitDetailRow from '@/components/UnitDetailRow.vue';
import { useDataStore } from '@/stores/data';
import { computed } from 'vue';
import orderBy from 'lodash/orderBy';

const props = defineProps<{
    faction: string
}>();

const dataStore = useDataStore();

const factionUnits = computed(() => {
    return orderBy(dataStore.getUnitsForFaction(props.faction), ['cost', 'name']);
})
</script>

<template>
  <table class="table table-hover table-sm table-responsive">
    <thead class="table-secondary">
      <tr>
        <th>&nbsp;</th>
        <th>Mv</th>
        <th>BS</th>
        <th>CS</th>
        <th>Df</th>
        <th>Lf</th>
        <th>Ld</th>
        <th>Role and Type</th>
        <th>Pts</th>
      </tr>
    </thead>
    <tbody>
      <UnitDetailRow v-for="(unit) in factionUnits" :key="unit.name" :unit="unit" />
    </tbody>
  </table>
</template>