<script setup lang="ts">
import { computed } from 'vue';
import { orderBy } from 'lodash-es';
import type { Unit } from '@/types/unit';
import UnitRow from './UnitRow.vue';

const props = defineProps<{
  models: Unit[],
  showFaction: boolean
}>();

const factionModels = computed(() => orderBy(props.models, ['name']));
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover">
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
          <th>Faction</th>
        </tr>
      </thead>
      <tbody>
        <UnitRow v-for="(unit) in factionModels" :key="unit.name" :unit="unit" :show-faction="showFaction" />
      </tbody>
    </table>
  </div>
</template>
