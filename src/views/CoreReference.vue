<template>
  <div class="core-reference">
    <div class="form-floating">
      <input id="search" v-model="queryString" type="text" autocomplete="off"
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
import { useReferenceStore } from '@/stores/reference';
import { computed, ref, watch } from 'vue';
import debounce from 'lodash/debounce'

const queryString = ref('');
  
const referenceStore = useReferenceStore();
 
referenceStore.initialise();

const setQueryString = debounce((s) => {
  referenceStore.setSearch(s); 
}, 400);

watch(queryString, (q) => {
  setQueryString(q);
});

const matchingRules = computed(() => referenceStore.matchingRules);

</script>

<style lang="scss">
  .core-reference {
    p, ul, table {
      margin-bottom: 0.5em;
    } 
    
    .card-body {
      :last-child {
        margin-bottom: 0;
      }
    }

    ul {
      padding-left: 1em;
    }
    table {
      border-top: 1px;
      border-bottom: 1px;

      thead tr {
        td, th {
          border-top-width: 1px;
        }
        th {
          background-color: #e8e9ea;
        }
      }

      tr {
        td, th { 
          padding: 0.25rem 0.5rem;
          border-bottom-width: 1px;
          border-bottom-color: #e8e9ea;

          &:first-of-type {
            white-space: nowrap;
          }
        }
      }

      tbody {
        tr {
          th {
            background-color: #e8e9ea;
          }
          &:last-of-type {
            td, th {
              border-color: inherit;
            }
          }
        }
      }
    }

  }
</style>