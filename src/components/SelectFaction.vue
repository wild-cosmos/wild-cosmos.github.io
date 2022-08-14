<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data';
import orderBy from 'lodash/orderBy';

const router = useRouter();
const dataStore = useDataStore();

defineProps<{
  msg: string
}>()

const selectedFaction = ref(null);

watch(selectedFaction, async (faction) => {
  if (faction) {
    router.push({ name: 'faction', params: { faction } });
  }
});


const factions = computed(() => orderBy(dataStore.factions));

</script>

<template>
  <div class="form-floating">
    <select id="floatingSelect" v-model="selectedFaction" class="form-select" aria-label="Selected faction">
      <option v-if="!selectedFaction" selected>
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
