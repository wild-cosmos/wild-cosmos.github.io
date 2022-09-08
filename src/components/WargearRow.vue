<script setup lang="ts">
import { computed } from 'vue';
import type { Wargear } from '@/types/unit';

const props = defineProps<{
  item: Wargear,
  showFaction: boolean
}>();

const faction = computed(() => (props.showFaction ? props.item.faction : null));
</script>

<template>
  <tr>
    <td>
      <span class="text-nowrap">{{ item.name }}</span>
      <small v-if="showFaction" class="ms-1">({{ faction }})</small>
    </td>
    <td><small style="white-space: pre-line">{{ item.notes || '-' }}</small></td>
  </tr>
</template>
