<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import SelectFaction from './components/SelectFaction.vue'; 
import { useDataStore } from './stores/data';
import { Collapse  } from 'bootstrap';
import { onMounted } from 'vue';

const dataStore = useDataStore();
dataStore.initialise('/wild-cosmos.json');

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
              aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/">
              Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/About">
              About
            </RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  </nav>

  <main class="container-fluid">
    <div class="bg-light">
      <SelectFaction msg="You did it!" />
    </div>

    <RouterView />
  </main>
</template>

<style>
/* Show it is fixed to the top */
#app {
  min-height: 75rem;
  margin-top: 4.5rem;
}
</style>
