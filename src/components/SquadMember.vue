<template>
  <div class="row py-2 border-top border-bottom">
    <div class="col-4 col-md-3">
      <div class="form-floating">
        <select id="selectUnit" v-model="unit" class="form-control">
          <option v-for="({ value, text }) in availableUnits" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectUnit">Unit</label>
      </div>
    </div>
    <div class="col">{{ selectedUnit }}</div>
    <div class="col-1"><span class="text-nowrap">{{ selectedUnit?.cost }} Pts</span></div>
  </div>
</template>

<script setup lang="ts">
import orderBy from 'lodash/orderBy'
import { useDataStore } from "@/stores/data";
import { useSquadStore } from "@/stores/squad";
import { computed, ref } from "vue";

const emit = defineEmits(['update:unit']);

const props = defineProps<{
    unit: any
}>();

const dataStore = useDataStore();
const squadStore = useSquadStore();

const unit = ref(null);

const availableUnits = computed(() => {
    const options = dataStore.getUnitsForFaction(squadStore.faction)
        .map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }))
    return orderBy(options, ['text']);
})

const selectedUnit = computed(() => {
  if (unit.value) {
    const selectedUnit = dataStore.getUnitsForFaction(squadStore.faction)
      .find(({name}) => unit.value === name);

    emit('update:unit', selectedUnit);

    return selectedUnit;
  }
  return null;
})

</script>

<style scoped>
</style>