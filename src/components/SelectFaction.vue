<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '@/stores/data';
import orderBy from 'lodash/orderBy';

const emit = defineEmits(['update:faction'])

const dataStore = useDataStore();

const props = defineProps<{
  faction: string | null,
  allowNull?: boolean,
}>()

const selectedFaction = computed({
  get() { return props.faction; },
  set(faction) { emit('update:faction', faction); }
})

const factions = computed(() => orderBy(dataStore.factions));

</script>

<template>
  <div class="form-floating">
    <select id="floatingSelect" v-model="selectedFaction" class="form-select" aria-label="Selected faction">
      <option v-if="allowNull || !selectedFaction" :value="null">
        - Select faction -
      </option>
      <option v-for="(name) in factions" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
    <label for="floatingSelect">Faction</label>
  </div>
</template>

<style scoped>
</style>
