<script setup lang="ts">
import { computed } from 'vue'
import isArray from 'lodash/isArray';
import formatStat from '@/utils/formatStat'

const props = defineProps<{
  unit: any
}>();

const movement = computed(() => {
  const { mv } = props.unit;
  if (isArray(mv)) {
    return mv.join('/');
  }
  return mv
})

const rolesAndTypes = computed(() => {
  const { roles, type } = props.unit;
  return [roles.join(' or '), type].filter((s) => s > '').join(', ');
})


// function formatStat(stat: [number, Array<number>], suffix = '') {
//   if (!stat) return '-';
//   if (isArray(stat)) return stat.map((n) => `${n}${suffix}`).join('/');
//   return `${stat}${suffix}`;
// }
</script>

<template>
  <tr>
    <td>{{ unit.name }}</td>
    <td>{{ formatStat(unit.mv, '"') }}</td>
    <td>{{ formatStat(unit.bs, '+') }}</td>
    <td>{{ formatStat(unit.cs, '+') }}</td>
    <td>{{ formatStat(unit.df, '+') }}</td>
    <td>{{ unit.lf }} <sub>{{ unit.si }}</sub></td>
    <td>{{ formatStat(unit.ld, '+') }}</td>
    <td>{{ rolesAndTypes }}</td>
    <td>{{ unit.cost }}</td>
  </tr>
</template>