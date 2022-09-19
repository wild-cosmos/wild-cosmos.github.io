<template>
  <div class="d-flex align-items-center justify-content-between">
    <h3 class="">
      {{ unit.name }}
    </h3>
    <div class="d-print-none ml-auto mb-2 button-bar align-end">
      <slot name="actions" />
    </div>
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
            {{ unit.cost }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <WeaponsList v-if="unit.weapons.length" class="d-print-none" :weapons="unit.weapons" />

  <div class="button-bar align-end d-print-none">
    <slot name="wargear-actions" />
  </div>

  <table class="table">
    <tbody>
      <tr class="align-middle">
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
      <tr class="align-middle">
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
      <tr class="align-middle">
        <th>Faction</th>
        <td>{{ formatList(unit.faction) }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="options" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { sortBy, isArray } from 'lodash-es';
import formatStat from '@/utils/formatStat';
import formatList from '@/utils/formatList';
import type { SquadUnit, Wargear, Weapon } from '@/types/unit';
import WeaponsList from './WeaponsList.vue';

const props = defineProps<{
  unit: SquadUnit
}>();

const unit = computed(() => props.unit);

const allWargear = computed(() => {
  const { weapons, wargear } = props.unit;
  const checkMissing = (item: Weapon | Wargear) => {
    if (!item) {
      return { name: 'Missing Item' };
    }
    return item;
  };
  const excludeHidden = (item: Weapon | Wargear) => !item?.hidden;

  return [
    ...(weapons ?? []).filter(excludeHidden).map(checkMissing).map(({ name }) => name),
    ...(wargear ?? []).filter(excludeHidden).map(checkMissing).map(({ name }) => name),
  ]
});

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
