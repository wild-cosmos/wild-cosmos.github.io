<script setup lang="ts">
import { computed } from 'vue';
import type { Wargear } from '@/types/unit';

const props = defineProps<{
  item: Wargear,
  showFaction: boolean
}>();

const notes = computed(() => props.item.notes || '-');
const faction = computed(() => (props.showFaction ? props.item.faction : null));
</script>

<template>
  <tr>
    <td>
      <span class="text-nowrap">{{ item.name }}</span>
      <small v-if="showFaction" class="d-block">({{ faction }})</small>
    </td>
    <td>
      <div class="small" style="white-space: pre-line" v-html="notes" />
    </td>
  </tr>
</template>
