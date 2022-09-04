<script setup lang="ts">
  import { computed } from 'vue'
  import type { Wargear } from '@/types/unit';
      
    const props = defineProps<{
      item: Wargear,
      showFaction: boolean
    }>();
    
    const faction = computed(() => {
      return props.showFaction ? props.item.faction : null;
    })
  </script>
  
<template>
  <tr>
    <td>
      {{ item.name }}
      <small v-if="showFaction">({{ faction }})</small>
    </td>
    <td><small style="white-space: pre-line">{{ item.notes || '-' }}</small></td>
  </tr>
</template>
  