<script setup lang="ts">
import { computed } from 'vue';
import orderBy from 'lodash/orderBy';
import UnitRow from './UnitRow.vue';
import type { Unit } from '@/types/unit';

const props = defineProps<{
  units: Unit[],
  showFaction: boolean
}>();

const factionUnits = computed(() => orderBy(props.units, ['name']));
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover table-sm">
      <thead class="table-secondary">
        <tr>
          <th>Model</th>
          <th>Mv</th>
          <th>BS</th>
          <th>CS</th>
          <th>Df</th>
          <th>Lf</th>
          <th>Ld</th>
          <th>Role and Type</th>
        </tr>
      </thead>
      <tbody>
        <UnitRow v-for="(unit) in factionUnits" :key="unit.name" :unit="unit" :show-faction="showFaction" />
      </tbody>
    </table>
  </div>
</template>
