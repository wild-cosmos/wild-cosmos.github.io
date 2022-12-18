<template>
  <tr v-for="({ name, range, a, ap, dm, notes }, idx) in weaponStats" :key="`${name}_${idx}`"
      :class="{ 'weapon-stats': true, 'melee-stats': idx > 0 }"
  >
    <td>
      <div v-if="name && (idx === 0 || name !== weapon.name)">
        {{ name }}
        <small v-if="showFaction" class="d-block">({{ faction }})</small>
      </div>
    </td>
    <td>{{ formatStat(range, '"') }}</td>
    <td>{{ formatStat(a) }}</td>
    <td>{{ formatStat(ap) }}</td>
    <td>{{ formatStat(dm) }}</td>
    <td><small>{{ notes || '-' }}</small></td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isObject } from 'lodash-es';
import formatStat from '@/utils/formatStat';
import type { Weapon } from '@/types/unit';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();

const props = defineProps<{
  weapon: Weapon,
  showFaction?: boolean
}>();

const weaponStats = computed(() => {
  const { name, combi, melee } = props.weapon;

  if (isObject(melee)) {
    return [
      props.weapon,
      { ...props.weapon, ...melee } as Weapon,
    ];
  }

  if (combi) {
    const combiWeapon = combi.map(dataStore.getWeapon)
      .filter((w) => !!w)
      .map((w, idx: number) => {
        const label = (idx > 0 ? null : name);
        return {
          ...w,
          name: w?.ammo ? w.name : label,
        };
      });
    return combiWeapon;
  }

  return [props.weapon];
});

const faction = computed(() => (props.showFaction ? props.weapon.faction : null));
</script>
