<script setup lang="ts">
import UnitRow from '@/components/UnitRow.vue';
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
  <div class="table-responsive">
    <table class="table table-hover table-sm">
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
        <UnitRow v-for="(unit) in factionUnits" :key="unit.name" :unit="unit" />
      </tbody>
    </table>
  </div>
</template>