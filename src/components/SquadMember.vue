<template>
  <div class="row py-2 border-top border-bottom">
    <div class="col-4 col-md-3">
      <div class="form-floating">
        <select id="selectUnit" v-model="selectedUnit" class="form-control">
          <option v-for="({ value, text }) in availableUnits" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectUnit">Unit</label>
      </div>
    </div>
    <div class="col-3">
      <div class="form-floating">
        <select id="selectWeapon" v-model="selectedWeapon" class="form-control">
          <option v-for="({ value, text }) in weaponsForUnit" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectWeapon">Primary Weapon</label>
      </div>
    </div>
    <div class="col">&nbsp;</div>
    <div class="col-1">
      <span class="text-nowrap">{{ unit.totalCost() }} Pts</span>
    </div>
  </div>
  <small>
    <code>{{ unit }}</code>
  </small>
</template>

<script setup lang="ts">
import orderBy from 'lodash/orderBy'
import { useDataStore } from "@/stores/data";
import { useSquadStore } from "@/stores/squad";
import { computed, ref, reactive } from "vue";

const emit = defineEmits(['update:unit']);

const props = defineProps<{
  unit: any
}>();

const dataStore = useDataStore();
const squadStore = useSquadStore();

// const state = reactive({ selectedUnit: null });

const availableUnits = computed(() => {
  const options = dataStore.getUnitsForFaction(squadStore.faction)
    .map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }))
  return orderBy(options, ['text']);
})

const weaponsForUnit = computed(() => {
  const options = dataStore.getWeaponsForUnit(props.unit.name)
    .map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }))
  return orderBy(options, ['text']);
})

const selectedUnit = computed({
  get() { return props.unit.name; },
  set(unitName) {
    if (unitName) {
      const selectedUnit = dataStore.getUnitsForFaction(squadStore.faction)
        .find(({ name }) => unitName === name);

      squadStore.setSquadMember(props.unit.id, selectedUnit)
      // emit('update:unit', selectedUnit);
    }
  }
})

const selectedWeapon = computed({
  get() { return props.unit.weapon?.name },
  set(weaponName) {
    if (weaponName) {
      const weapon = dataStore.getWeaponsForUnit(props.unit.name)
        .find(({ name }) => name === weaponName)

      squadStore.setWeapon(props.unit.id, weapon)
    }
  }
})
</script>

<style scoped>
</style>