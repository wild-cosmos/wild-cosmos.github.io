<script setup lang="ts">
import { computed } from 'vue';
import formatStat from '@/utils/formatStat';
import type { Unit } from '@/types/unit';
import { isArray } from 'lodash-es';

const props = defineProps<{
  unit: Unit,
  showFaction: boolean
}>();

const rolesAndTypes = computed(() => {
  const { type } = props.unit;
  const rolesAsArray = ({ roles }: Unit) => (isArray(roles) ? roles : Object.keys(roles));

  return [rolesAsArray(props.unit).join(' or '), ...type].filter((s) => s > '').join(', ');
});

const factions = computed(() => {
  const { faction } = props.unit;
  return faction?.join(', ');
});

const calcSi = computed(() => Math.round(props.unit.lf / 4));
</script>

<template>
  <tr>
    <td>{{ unit.name }}</td>
    <td>{{ formatStat(unit.mv, '"') }}</td>
    <td>{{ formatStat(unit.bs, '+') }}</td>
    <td>{{ formatStat(unit.cs, '+') }}</td>
    <td>{{ formatStat(unit.df, '+') }}</td>
    <td class="text-nowrap">
      {{ unit.lf }}<sub>{{ calcSi }}</sub>
    </td>
    <td>{{ formatStat(unit.ld, '+') }}</td>
    <td>{{ rolesAndTypes }}</td>
    <td>{{ factions }}</td>
  </tr>
</template>
