<template>
  <nav class="navbar navbar-expand-md navbar-light fixed-top bg-light shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand py-0" href="#">
        <img src="./assets/wild_cosmos_logo.png" alt="" height="64" class="d-inline-block">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/builder">
              Warband Builder
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/reference">
              Reference
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

  <main class="container-lg px-lg-0" :class="appEnv">
    <RouterView />
  </main>

  <OrbitzBanner />
</template>

<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router';
  import { useDataStore } from './stores/data';
  import { Collapse } from 'bootstrap';
  import { onMounted } from 'vue';
  import OrbitzBanner from './components/OrbitzBanner.vue';
  
  const dataStore = useDataStore();
  dataStore.initialise('/factions.json');
  
  const appEnv = import.meta.env.MODE;
  
  onMounted(() => {
    const el = document.getElementById('navbarCollapse')
    if (el) new Collapse(el, { toggle: false })
  });
</script>
    
<style>
#app {
  margin-top: calc(64px + 2rem);
  margin-bottom: 5rem;
}
</style>
