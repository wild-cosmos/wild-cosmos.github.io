<template>
  <div class="form-floating">
    <select id="faction" v-model="selectedFaction"
      class="form-select" aria-label="Selected faction" placeholder="Faction">
      <option v-if="allowNull || !selectedFaction" :value="null">
        Select Faction
      </option>
      <option v-for="(name) in factions" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
    <label for="faction">Faction</label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { orderBy } from 'lodash-es';
import { useDataStore } from '@/stores/data';

const emit = defineEmits(['update:faction']);

const dataStore = useDataStore();

const props = defineProps<{
  faction: string | null,
  allowNull?: boolean,
}>();

const selectedFaction = computed({
  get() { return props.faction; },
  set(faction) { emit('update:faction', faction); },
});

const factions = computed(() => orderBy(dataStore.getUniqueFactions));

</script>

<style scoped>
</style>
