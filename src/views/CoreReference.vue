<template>
  <div class="rules">
    <div class="form-floating">
      <input id="search" v-model="queryString" type="text" autocomplete="off"
      placeholder="Search"
      class="form-control" aria-label="Search">
      <label for="search">Search</label>
    </div>
    <div>
      <section v-for="{ title, section } in matchingRules" :key="title"
        class="card my-3">
        <h5 class="card-header">{{ title }}</h5>
        <div class="card-body" v-html="section" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { debounce, orderBy } from 'lodash-es';
import { useReferenceStore } from '@/stores/reference';

const queryString = ref('');

const referenceStore = useReferenceStore();

referenceStore.initialise();

const setQueryString = debounce((s) => {
  referenceStore.setSearch(s);
}, 250);

watch(queryString, (q) => {
  setQueryString(q);
});

const matchingRules = computed(() => orderBy(referenceStore.matchingRules, ['title']));

</script>
