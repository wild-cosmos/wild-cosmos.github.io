<script setup lang="ts">
import { computed } from 'vue'
import formatStat from '@/utils/formatStat'
import  isObject from 'lodash/isObject';
import type { Weapon } from '@/types/unit';
import { useDataStore } from '@/stores/data';
  
const dataStore = useDataStore()

  const props = defineProps<{
    weapon: Weapon,
    showFaction: boolean
  }>();
  
  const weaponStats = computed(() => {
    const { name, combi, melee } = props.weapon;

    if (isObject(melee)) {
      return [
        props.weapon,
        melee,
      ]
    }

    if (combi) {
      const combiWeapon = combi.map(dataStore.getWeapon)
        .filter((w) => !!w)
        .map((w, idx: number)=> ({
          ...w,
          name: idx > 0 ? null :name
        }));
      return combiWeapon;
    }

    return [props.weapon];
  })

  const faction = computed(() => {
    return props.showFaction ? props.weapon.faction : null;
  })
</script>

<template>
  <tr v-for="({ name, range, a, ap, dm, notes }, idx) in weaponStats" :key="`${name}_${idx}`" 
    :class="{ 'weapon-stats': true, 'melee-stats': idx > 0 }">
    <td>
      <div v-if="name">
        {{ name }}
        <small v-if="showFaction">({{ faction }})</small>
      </div>
    </td>
    <td>{{ formatStat(range, '"') }}</td>
    <td>{{ formatStat(a) }}</td>
    <td>{{ formatStat(ap) }}</td>
    <td>{{ formatStat(dm) }}</td>
    <td><small>{{ notes || '-' }}</small></td>
  </tr>
</template>
