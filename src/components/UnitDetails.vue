<template>
  <div class="d-flex align-items-center justify-content-between">
    <h3>
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
          {{ unit.lf }}<sub>{{ calcSi }}</sub>
        </td>
        <td class="stat">
          {{ formatStat(unit.ld, "+") }}
        </td>
        <td :class="{ 'text-danger': roleWarning }">
          <i v-if="roleWarning" class="bi-exclamation-diamond" />
          {{ formatList(unitRoleAndType) }}
        </td>
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
      <tr v-if="props.unit.limits" class="align-middle">
        <th>Limits</th>
        <td>{{ props.unit.limits.comment }}</td>
      </tr>
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
        <td>{{ formatList(props.unit.faction) }}</td>
      </tr>
    </tbody>
  </table>

  <slot name="options" :roles-for-unit="validRolesForUnit" />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { sortBy } from 'lodash-es';
import formatStat from '@/utils/formatStat';
import formatList from '@/utils/formatList';
import type { SquadUnit, Wargear, Weapon } from '@/types/unit';
import { applyModelRules } from '@/model-rules';
import { modelRoleAndType, validRolesForModel } from '@/utils/role-helpers';
import WeaponsList from './WeaponsList.vue';

const props = defineProps<{
  unit: SquadUnit
}>();

const dataStore = inject('dataStore');
const squadStore = inject('squadStore');

const unitType = computed(() => applyModelRules(squadStore.models, dataStore.getModelByName(props.unit.name)));

const calcSi = computed(() => Math.round(props.unit.lf / 4));

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
  ];
});

const unitRoleAndType = computed(() => modelRoleAndType(props.unit));

const validRolesForUnit = computed(() => validRolesForModel(unitType.value));

const roleWarning = computed(() => {
  const { role } = props.unit;
  return role > '' && !validRolesForUnit.value.includes(role);
});

const unitAbilities = computed(() => sortBy(props.unit.abilities));

</script>

<style>
td.stat {
  width: 4rem;
}
</style>
