<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data';

defineProps<{
  msg: string
}>()

const selectedFaction = ref(null);

const dataStore = useDataStore();

const factions = computed(() => dataStore.factions);

</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      Loaded the following factions:
      <ul>
        <li v-for="(name) in factions" :key="name">{{ name }}</li>
      </ul>


      <div class="form-floating">
        <select v-model="selectedFaction" class="form-select" id="floatingSelect"
          aria-label="Floating label select example">
          <option selected>Open this select menu</option>
          <option v-for="(name) in factions" :value="name" :key="name">
            {{ name }}</option>
        </select>
        <label for="floatingSelect">Select Faction</label>
      </div>
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
