<template>
  <div class="d-flex align-items-center justify-content-between">
    <h3 class="mt-3">
      {{ unit.name }}
    </h3>
    <slot name="actions" />
  </div>
  <table class="table table-sm">
    <thead>
      <tr class="table-secondary">
        <th>Mv</th>
        <th>BS</th>
        <th>CS</th>
        <th>Df</th>
        <th>Lf</th>
        <th>Ld</th>
        <th>Role and Type</th>
        <th>
          <div class="text-end">
            Pts
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="stat">
          {{ formatStat(unit.mv, '"') }}
        </td>
        <td class="stat">
          {{ formatStat(unit.bs, "+") }}
        </td>
        <td class="stat">
          {{ formatStat(unit.cs, "+") }}
        </td>
        <td class="stat">
          {{ formatStat(unit.df, "+") }}
        </td>
        <td class="stat text-nowrap">
          {{ unit.lf }}<sub>{{ unit.si }}</sub>
        </td>
        <td class="stat">
          {{ formatStat(unit.ld, "+") }}
        </td>
        <td>{{ formatList(unitRoleAndType) }}</td>
        <td>
          <div class="text-end">
            {{ totalCost }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <WeaponsList class="d-print-none" :weapons="unit.weapons" />
  <table class="table table-sm">
    <tbody>
      <tr>
        <th>Wargear</th>
        <td>
          <span v-for="(wargear, i) in allWargear" :key="`wargear_${i}`" class="d-print-none badge bg-primary me-1">
            {{ wargear }}
          </span>
          <span class="d-none d-print-inline">
            {{ formatList(allWargear) }}
          </span>
        </td>
      </tr>
      <tr>
        <th>Abilities</th>
        <td>
          <span v-for="(ability) in unitAbilities" :key="ability" class="d-print-none badge bg-primary me-1">
            {{ ability }}
          </span>
          <span class="d-none d-print-inline">
            {{ formatList(unitAbilities) }}
          </span>
        </td>
      </tr>
      <tr>
        <th>Faction</th>
        <td>{{ unit.faction }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import sortBy from 'lodash/sortBy';
import isArray from 'lodash/isArray';
import formatStat from '@/utils/formatStat';
import formatList from '@/utils/formatList';
import calcTotalCost from '@/utils/totalCost';
import type { SquadUnit, Wargear, Weapon } from '@/types/unit';
import WeaponsList from './WeaponsList.vue';

const props = defineProps<{
  unit: SquadUnit
}>();

const unit = computed(() => props.unit);

const allWargear = computed(() => {
  const loadout = [];
  const { weapons, wargear } = props.unit;
  const checkMissing = (item: Weapon | Wargear) => {
    if (!item) {
      return { name: 'Missing Item' };
    }
    return item;
  };

  if (weapons?.length) loadout.push(...weapons.map(checkMissing).map(({ name }) => name));
  if (wargear?.length) loadout.push(...wargear.map(checkMissing).map(({ name }) => name));
  return loadout;
});

const totalCost = computed(() => calcTotalCost(props.unit));

const unitRoleAndType = computed(() => {
  const { role, type } = props.unit;
  const roleAndType: string[] = [];
  if (role) roleAndType.push(role);
  if (isArray(type)) {
    roleAndType.push(...type);
  } else {
    roleAndType.push(type);
  }
  return roleAndType;
});

const unitAbilities = computed(() => sortBy(props.unit.abilities));

</script>

<style>
td.stat {
  width: 4rem;
}
</style>
