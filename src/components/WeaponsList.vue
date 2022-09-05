<template>
  <div class="table-responsive">
    <table class="table table-hover table-sm">
      <thead class="table-secondary">
        <tr>
          <th>Weapon</th>
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
import { computed } from 'vue';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import WeaponRow from './WeaponRow.vue';
import type { Weapon } from '@/types/unit';

const props = defineProps<{
  weapons: Weapon[],
  showFaction?: boolean
}>();

const factionWeapons = computed(() => orderBy(props.weapons, ['name']));

const weaponsByFaction = computed(() => groupBy(props.weapons, 'faction'));
</script>

<style lang="css">
tr.weapon-stats td {
  border-top-width: 1px;
  border-bottom-width: 0;
}

tr.weapon-stats+tr.melee-stats td {
  border-top-width: 0;
}

tr.weapon-stats:last-of-type td {
  border-bottom-width: 1px;
}
</style>
