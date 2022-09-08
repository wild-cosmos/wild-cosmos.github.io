<template>
  <nav class="d-print-none navbar navbar-expand-md navbar-light fixed-top bg-light shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand py-0" href="#">
        <img src="./assets/wild_cosmos_logo.png" alt="" height="64" width="256" class="d-inline-block">
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
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/rules">
              Rules
            </RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Useful Links
            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item"
                  href="https://drive.google.com/file/d/1eQ5XuCMya0glnFFAUHfl825W-RcZ43jV/view?usp=sharing"
                  target="_blank">
                  Core Rules
                </a>
              </li>
              <li>
                <a class="dropdown-item"
                  href="https://drive.google.com/drive/u/2/folders/1_AT9l8767WZn3r46qmTbWjCsnY9IZ75_" target="_blank">
                  Faction Books
                </a>
              </li>
            </ul>
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

  <OrbitzBanner class="d-print-none" />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { Collapse } from 'bootstrap';
import { onMounted } from 'vue';
import { useDataStore } from './stores/data';
import OrbitzBanner from './components/OrbitzBanner.vue';

const dataStore = useDataStore();
dataStore.initialise('/factions.json');

const appEnv = import.meta.env.MODE;

onMounted(() => {
  const el = document.getElementById('navbarCollapse');
  // eslint-disable-next-line no-new
  if (el) new Collapse(el, { toggle: false });
});
</script>

<style>
#app {
  margin-top: calc(64px + 2rem);
  margin-bottom: 5rem;
}

@media print {
  #app {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
