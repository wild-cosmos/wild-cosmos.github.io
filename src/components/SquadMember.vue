<template>
  <UnitDetails :unit="unit">
    <template #actions>
      <button class="btn btn-sm btn-danger ml-auto"
      @click="onClickRemove">
        Remove
      </button>
    </template>
  </UnitDetails>
    <div v-if="unit" class="col">
  <div class="d-print-none row py-2">
      <div class="form-floating">
        <select id="selectWeapon" v-model="selectedWeapon" class="form-control">
          <option v-for="({ value, text }) in weaponOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectWeapon">Weapon</label>
      </div>
    </div>
    <div v-if="unit" class="col">
      <div class="form-floating">
        <select v-model="selectedRole" class="form-control">
          <option v-for="(r) in rolesForUnit" :key="r" :value="r">
            {{ r }}
          </option>
        </select>
        <label for="selectWeapon">Role</label>
      </div>
    </div>
    <div v-if="false" class="col-5">
      <div v-for="{ value, text } in wargearOptions" :key="value" class="form-check">
        <input type="checkbox" :value="value" class="form-check-input">
        <label class="form-check-label" for="flexCheckDefault">
          {{ text }}
        </label>
      </div>
    </div>
  </div>


  <small v-if="false" class="d-print-none">
    <code>{{ unit }}</code>
  </small>

  <div class="border-bottom" />
</template>

<script setup lang="ts">
import UnitDetails from './UnitDetails.vue'

import { useDataStore } from "@/stores/data";
import { useSquadStore } from "@/stores/squad";
import { computed } from "vue";

import orderBy from 'lodash/orderBy'
import isArray from 'lodash/isArray'

const devMode = import.meta.env.DEV;

const emit = defineEmits(['update:unit']);

const props = defineProps<{
  unit: any
}>();

const dataStore = useDataStore();
const squadStore = useSquadStore();

const toOption = ({ name, cost }) => ({ value: name, text: `${name} (${cost})` });

const weaponsForUnit = computed(() => dataStore.getWeaponsForUnit(props.unit))

const weaponOptions = computed(() => {
  const options = dataStore.getWeaponsForUnit(props.unit)
    .map(({ name, cost }: { name: string, cost: number }) => ({ value: name, text: `${name} (${cost})` }))
  return orderBy(options, ['text']);
})

const wargearForUnit = computed(() => {
  const { wargear } = props.unit;
  if (wargear) {
    return Object.entries(wargear).map(([name, cost]) => ({ name, cost }))
  }
  return [];
})

const wargearOptions = computed(() => {
  return wargearForUnit.value.map(toOption);
})

const rolesForUnit = computed(() => {
  const { id, roles } = props.unit
  const options = isArray(roles) ? roles : [roles];
  if (options.length) squadStore.setRole(id, options[0])
  return options
})

const selectedWeapon = computed({
  get() { return props.unit.weapon?.name },
  set(weaponName) {
    if (weaponName) {
      const weapon = weaponsForUnit.value.find(({ name }) => name === weaponName);

      squadStore.setWeapon(props.unit.id, weapon)
    }
  }
})

const selectedRole = computed({
  get() {
    return props.unit.role;
  },
  set(role) {
    squadStore.setRole(props.unit.id, role);
  }
})

function onClickRemove() {
  if (props.unit) {
    squadStore.removeSquadMember(props.unit)
  }
}
</script>

<style scoped>
</style>