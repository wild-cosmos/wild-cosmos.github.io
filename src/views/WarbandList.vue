<template>
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="my-0">
      My Warbands
    </h3>
    <button type="button" class="btn btn-success" @click="addWarband">
      Create Warband
    </button>
  </div>
  <div v-for="{ id, name, fluff } in warbandStore.warbands" :key="id" class="py-3 border-top border-bottom">
    <div class="d-flex justify-content-between">
      <h4>{{ name || '- Unnamed Warband -' }}</h4>
      <router-link :to="{ name: 'warband', params: { id } }" class="btn btn-primary">
        View/Edit
      </router-link>
    </div>
    <div>{{ fluff }}</div>
  </div>
</template>

<script setup lang="ts">
import { useWarbandStore } from '@/stores/warband';
import { useRouter } from 'vue-router';

const warbandStore = useWarbandStore();
const router = useRouter();

function addWarband() {
  const { id } = warbandStore.add();
  router.push({ name: 'warband', params: { id } });
}
</script>
