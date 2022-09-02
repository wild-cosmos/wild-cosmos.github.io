<script setup lang="ts">
import { computed } from 'vue'
import isArray from 'lodash/isArray';
import formatStat from '@/utils/formatStat'
import type { Unit } from '@/types/unit';

const props = defineProps<{
  unit: Unit,
  showFaction: boolean
}>();

const rolesAndTypes = computed(() => {
  const { roles, type } = props.unit;
  return [roles.join(' or '), ...type].filter((s) => s > '').join(', ');
})
</script>

<template>
  <tr>
    <td>
      {{ unit.name }}
      <span v-if="showFaction">({{ unit.faction }})</span>
    </td>
    <td>{{ formatStat(unit.mv, '"') }}</td>
    <td>{{ formatStat(unit.bs, '+') }}</td>
    <td>{{ formatStat(unit.cs, '+') }}</td>
    <td>{{ formatStat(unit.df, '+') }}</td>
    <td class="text-nowrap">
      {{ unit.lf }}<sub>{{ unit.si }}</sub>
    </td>
    <td>{{ formatStat(unit.ld, '+') }}</td>
    <td>{{ rolesAndTypes }}</td>
  </tr>
</template>