<template>
  <UnitDetails :unit="unit" />
  <div class="d-print-none row py-2 border-top border-bottom">
    <div v-if="false" class="col-4 col-md-3">
      <div class="form-floating">
        <select id="selectUnit" v-model="selectedUnit" class="form-control">
          <option v-for="({ value, text }) in availableUnits" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectUnit">Unit</label>
      </div>
    </div>
    <div v-if="unit" class="col-3">
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
    <div v-if="false" class="col-1">
      <span class="text-nowrap">
        {{ unit.totalCost() }} Pts
      </span>
    </div>
    <div class="col-5">
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


  <small class="d-print-none">
    <code>{{ unit }}</code>
  </small>
</template>

<script setup lang="ts">
import UnitDetails from './UnitDetails.vue'

import { useDataStore } from "@/stores/data";
import { useSquadStore } from "@/stores/squad";
import { computed, ref, reactive } from "vue";

import orderBy from 'lodash/orderBy'
import isArray from 'lodash/isArray'

const emit = defineEmits(['update:unit']);

const props = defineProps<{
  unit: any
}>();

const dataStore = useDataStore();
const squadStore = useSquadStore();

const toOption = ({ name, cost }) => ({ value: name, text: `${name} (${cost})` });

// const state = reactive({ selectedUnit: null });

const availableUnits = computed(() => {
  const options = dataStore.getUnitsForFaction(squadStore.faction)
    .map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }))
  return orderBy(options, ['text']);
})

const weaponsForUnit = computed(() => {
  if (props.unit.weapons) {
    return props.unit.weapons.map((w: string) => {
      if (isArray(w)) {
        const { name, cost } = w.map((name) => dataStore.getWeapon(name) || dataStore.getWargear(name))
          .filter((w) => !!w)
          .reduce((m, { name, cost }) => {
            m.name.push(name)
            m.cost.push(cost);
            return m
          }, { name: [] as Array<string>, cost: [] as Array<number> })
        return {
          name: name.join('/'),
          cost: cost.reduce((sum: number, v: number) => sum + v, 0)
        };
      } else {
        return dataStore.getWeapon(w);
      }
    })
  }

  return dataStore.getWeaponsForUnit(props.unit.name);
})

const weaponOptions = computed(() => {
  const options = weaponsForUnit.value
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

const selectedUnit = computed({
  get() { return props.unit.name; },
  set(unitName) {
    if (unitName) {
      const selectedUnit = dataStore.getUnitsForFaction(squadStore.faction)
        .find(({ name }) => unitName === name);

      squadStore.setSquadMember(props.unit.id, { weapons: null, ...selectedUnit })
      // emit('update:unit', selectedUnit);
    }
  }
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
</script>

<style scoped>
</style>