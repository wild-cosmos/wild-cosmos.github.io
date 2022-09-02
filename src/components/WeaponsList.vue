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
        <WeaponRow v-for="(weapon) in factionWeapons" :key="weapon.name" :weapon="weapon" :show-faction="showFaction" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import WeaponRow from './WeaponRow.vue';
import { computed } from 'vue';
import orderBy from 'lodash/orderBy';
import type { Weapon } from '@/types/unit';

const props = defineProps<{
  weapons: Array<Weapon>,
  showFaction: boolean
}>();

const factionWeapons = computed(() => {
  return orderBy(props.weapons, ['name']);
})
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