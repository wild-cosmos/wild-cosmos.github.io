<template>
  <tr>
    <td>
      <span class="text-nowrap">{{ item.name }}</span>
      <small v-if="showFaction" class="d-block">({{ faction }})</small>
    </td>
    <td>
      <div class="small rules" v-html="description" />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDataStore } from '@/stores/data';

export default defineComponent({
  props: {
    item: { type: Object, required: true },
    showFaction: { type: Boolean, default: false },
  },
  setup() {
    // const props = defineProps<Props>();

    const dataStore = useDataStore();

    return { dataStore };
  },
  data() {
    return {
      description: null,
    };
  },
  created() {
    if (this.item?.name) {
      this.dataStore.getAbility(this.item)
        .then(({ description }) => {
          this.description = description;
        });
    }
  },
});
</script>

<style lang="scss" scoped>

</style>
