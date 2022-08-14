<script setup lang="ts">
import { computed } from 'vue'
import isArray from 'lodash/isArray';

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
    return [roles.join(' or '), type].join(', ');
})

function formatStat(stat : [number, Array<number>], suffix = '') {
  if (isArray(stat)) return stat.map((n) => `${n}${suffix}`).join('/');
  return stat;
}
</script>
<template>
  <tr>
    <td>{{ unit.name }}</td>
    <td>{{ movement }}</td>
    <td>{{ unit.bs }}+</td>
    <td>{{ unit.cs }}+</td>
    <td>{{ formatStat(unit.df, '+') }}</td>
    <td>{{ unit.lf }} <sub>{{ unit.si }}</sub></td>
    <td>{{ unit.ld }}+</td>
    <td>{{ rolesAndTypes }}</td>
    <td>{{ unit.cost }}</td>
  </tr>
</template>