<template>
  <div class="table-responsive">
    <table class="table table-hover table-sm">
      <thead class="table-secondary">
        <tr>
          <th>Item</th>
          <th>Abilities</th>
        </tr>
      </thead>
      <tbody>
        <WargearRow v-for="(item) in factionWargear" :key="item.name" :item="item" :show-faction="showFaction" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import WargearRow from './WargearRow.vue';
import { computed } from 'vue';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import type { Wargear } from '@/types/unit';

const props = defineProps<{
  wargear: Wargear[],
  showFaction: boolean
}>();

const factionWargear = computed(() => {
  return orderBy(props.wargear, ['name']);
})

const wargearByFaction = computed(() => groupBy(props.wargear, 'faction'))
</script>


<style lang="css">
  tr.weapon-stats td {
    border-top-width: 1px;
    border-bottom-width: 0;
  }
  tr.weapon-stats + tr.melee-stats td {
    border-top-width: 0;
  }
  tr.weapon-stats:last-of-type td {
    border-bottom-width: 1px;
  }
</style>