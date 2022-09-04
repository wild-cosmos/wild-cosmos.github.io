<template>
  <UnitDetails :unit="unit">
    <template #actions>
      <button class="d-print-none btn btn-sm btn-danger ml-auto" @click="onClickRemove">
        Remove
      </button>
    </template>
  </UnitDetails>
  <div class="d-print-none row py-2">
    <div v-if="buildOptions.length" class="col">
      <div class="form-floating">
        <select id="selectBuildOption" v-model="selectBuildOption" class="form-control">
          <option v-for="({ value, text }) in buildOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectBuildOption">Build Option</label>
      </div>
    </div>
    <div v-else-if="weaponOptions.length > 1" class="col">
      <div class="form-floating">
        <select id="selectWeapon" v-model="selectedWeapon" class="form-control">
          <option v-for="({ value, text }) in weaponOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectWeapon">Weapon</label>
      </div>
    </div>
    <div v-if="rolesForUnit.length > 1" class="col">
      <div class="form-floating">
        <select v-model="selectedRole" class="form-control">
          <option v-for="(r) in rolesForUnit" :key="r" :value="r">
            {{ r }}
          </option>
        </select>
        <label for="selectRole">Role</label>
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
import { computed, ref } from "vue";

import orderBy from 'lodash/orderBy'
import isArray from 'lodash/isArray'
import type { Item, SquadUnit, Weapon } from '@/types/unit';

const devMode = import.meta.env.DEV;

const emit = defineEmits(['update:unit']);

const props = defineProps<{
  unit: SquadUnit
}>();

const dataStore = useDataStore();
const squadStore = useSquadStore();

const unitType = computed(() => dataStore.getUnitByName(props.unit.name));

const toOption = ({ name, cost }: Item) => {
  console.log(name, cost)
  return { value: name, text: `${name} (${cost})` };
}

const buildOptions = computed(() => {
  const options = dataStore.getBuildOptionsForUnit(props.unit);
  return options.map(({ cost, weapons = [], wargear = [] }, idx) => ({
    weapons,
    wargear,
    cost,
    text: `${[...weapons, ...wargear].join('/')} (${cost})`,
    value: idx,
  }));
});

const weaponsForUnit = computed(() => dataStore.getWeaponsForUnit(props.unit))

const weaponOptions = computed(() => {
  const options = dataStore.getWeaponsForUnit(props.unit)
    .map(toOption);
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
  if (!unitType.value) return [];
  const { roles } = unitType.value;
  const options = isArray(roles) ? roles : [roles];
  return options;
})

const selectBuildOption = computed({
  get() { return null; },
  set(selectedBuildOption) {
    const loadout = buildOptions.value.find(({ value }) => value === selectedBuildOption);

    if (loadout) {
      const weapons = loadout.weapons.map(dataStore.getWeapon);
      const wargear = loadout.wargear.map(dataStore.getWargear);

      squadStore.setWeapons(props.unit.id, weapons.filter(w => !!w), loadout.cost);
      squadStore.setWargear(props.unit.id, wargear.filter(w => !!w));
    }
  }
});

const selectedWeapon = computed({
  get() { return props.unit.weapon?.name },
  set(weaponName) {
    if (weaponName) {
      const weapon = weaponsForUnit.value.find(({ name }) => name === weaponName);

      squadStore.setWeapons(props.unit.id, [weapon])
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