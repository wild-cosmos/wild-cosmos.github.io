<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDataStore } from '@/stores/data';

const router = useRouter();
const dataStore = useDataStore();

defineProps<{
  msg: string
}>()

const selectedFaction = ref(null);

watch(selectedFaction, async (faction) => {
  router.push({ name: 'faction', params: { faction } });
});


const factions = computed(() => dataStore.factions);

</script>

<template>
  <div class="greetings">
    <h1 class="green">
      {{ msg }}
    </h1>
    <div class="form-floating">
      <select
        id="floatingSelect"
        v-model="selectedFaction"
        class="form-select"
        aria-label="Selected faction"
      >
        <option selected>
          Open this select menu
        </option>
        <option
          v-for="(name) in factions"
          :key="name"
          :value="name"
        >
          {{ name }}
        </option>
      </select>
      <label for="floatingSelect">Faction</label>
    </div>
  </div>
</template>

<style scoped>
</style>
