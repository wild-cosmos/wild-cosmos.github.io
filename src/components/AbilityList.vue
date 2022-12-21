<template>
  <div class="table-responsive">
    <table class="table table-hover table-sm">
      <thead class="table-secondary">
        <tr>
          <th>Ability</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <AbilityRow v-for="(item) in items" :key="item.name" :item="item"
          :show-faction="showFaction" />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AbilityRow from './AbilityRow.vue';

export default defineComponent({
  components: { AbilityRow },
  props: {
    items: { type: Array, required: true },
    showFaction: { type: Boolean, default: false },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>

</style>
