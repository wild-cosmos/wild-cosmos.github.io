<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useDataStore } from './stores/data';
import { Collapse } from 'bootstrap';
import { onMounted } from 'vue';

const dataStore = useDataStore();
dataStore.initialise('/factions.json');

onMounted(() => {
  const el = document.getElementById('navbarCollapse')
  if (el) new Collapse(el, { toggle: false })
});
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Wild Cosmos<span class="d-none d-sm-inline"> - Warband Builder</span></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/faction">
              Faction Units
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/builder">
              Squad Builder
            </RouterLink>
          </li>
        </ul>
        <form v-if="false" class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  </nav>

  <main class="container-fluid">
    <RouterView />
  </main>
</template>

<style>
/* Show it is fixed to the top */
#app {
  margin-top: 4.5rem;
}
</style>
