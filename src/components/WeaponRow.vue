<script setup lang="ts">
  import { computed } from 'vue'
  import isArray from 'lodash/isArray';
  import formatStat from '@/utils/formatStat'
import  isObject from 'lodash/isObject';
  
  const props = defineProps<{
    weapon: any
  }>();
  
  const isRangeAndMelee = computed(() => {
    const { melee } = props.weapon;
    console.log(props.weapon.name, props.weapon.melee, isObject(melee))
    return isObject(melee);
  })
</script>

<template>
  <tr>
    <td>{{ weapon.name }}</td>
    <td>{{ formatStat(weapon.range, '"') }}</td>
    <td>{{ formatStat(weapon.a) }}</td>
    <td>{{ formatStat(weapon.ap) }}</td>
    <td>{{ formatStat(weapon.dm) }}</td>
    <td><small>{{ weapon.notes }}</small></td>
  </tr>
  <tr v-if="isRangeAndMelee">
    <td>{{ weapon.name }}</td>
    <td>-</td>
    <td>{{ formatStat(weapon.melee.a) }}</td>
    <td>{{ formatStat(weapon.melee.ap) }}</td>
    <td>{{ formatStat(weapon.melee.dm) }}</td>
    <td><small>{{ weapon.melee.notes }}</small></td>
  </tr>
</template>