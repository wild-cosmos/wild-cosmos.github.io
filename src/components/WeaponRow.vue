<script setup lang="ts">
import { computed } from 'vue'
import formatStat from '@/utils/formatStat'
import  isObject from 'lodash/isObject';
  
  const props = defineProps<{
    weapon: any,
    showFaction: boolean
  }>();
  
  const isRangeAndMelee = computed(() => {
    const { melee } = props.weapon;
    return isObject(melee);
  })
</script>

<template>
  <tr class="weapon-stats">
    <td>
      {{ weapon.name }}
      <span v-if="showFaction">({{ weapon.faction }})</span>
    </td>
    <td>{{ formatStat(weapon.range, '"') }}</td>
    <td>{{ formatStat(weapon.a) }}</td>
    <td>{{ formatStat(weapon.ap) }}</td>
    <td>{{ formatStat(weapon.dm) }}</td>
    <td><small>{{ weapon.notes }}</small></td>
  </tr>
  <tr v-if="isRangeAndMelee" class="weapon-stats melee-stats">
    <td>{{ weapon.name }}</td>
    <td>-</td>
    <td>{{ formatStat(weapon.melee.a) }}</td>
    <td>{{ formatStat(weapon.melee.ap) }}</td>
    <td>{{ formatStat(weapon.melee.dm) }}</td>
    <td><small>{{ weapon.melee.notes }}</small></td>
  </tr>
</template>
