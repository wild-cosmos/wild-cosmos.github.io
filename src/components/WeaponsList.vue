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
import { orderBy } from 'lodash-es';
import WeaponRow from './WeaponRow.vue';
import type { Weapon } from '@/types/unit';

interface Props {
  weapons: Weapon[],
  showFaction?: boolean
}

const props = defineProps<Props>();

const factionWeapons = computed(() => {
  const weapons = props.weapons.filter((weapon) => !!weapon).filter(({ ammo, hidden }) => !hidden && !ammo);
  return orderBy(weapons, ['name']);
});
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
