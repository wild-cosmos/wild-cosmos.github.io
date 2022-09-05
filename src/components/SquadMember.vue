<template>
  <UnitDetails :unit="unit">
    <template #actions>
      <button class="d-print-none btn btn-sm btn-danger ml-auto" @click="onClickRemove">
        Remove
      </button>
    </template>
  </UnitDetails>
  <div class="d-print-none row py-2">
    <div v-if="buildOptions.length > 1" class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
      <div class="d-flex">
      <div class="form-floating flex-grow-1">
        <select id="selectBuildOption" v-model="selectBuildOption" class="form-control">
          <option v-for="({ value, text }) in buildOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectBuildOption">Build Option</label>
      </div>
      <button class="btn btn-outline-primary ms-2" @click="onClickReset">Reset</button>
      </div>
    </div>

    <div v-else-if="weaponOptions.length > 1" class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
      <div class="form-floating">
        <select id="selectWeapon" v-model="selectedWeapon" class="form-control">
          <option v-for="({ value, text }) in weaponOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectWeapon">Weapon</label>
      </div>
    </div>

    <div v-if="buildOptions.length || availableConfigurationOptions.length" class="col-12 col-md-8 col-xl-4 mb-3 mb-sm-0">
      <div class="d-flex align-items-center">
      <div class="form-floating flex-grow-1">
        <select id="selectConfig" v-model="selectedOption" 
          :disabled="!availableConfigurationOptions.length"
          class="form-control">
          <option :value="null" disabled>
            {{ numAvailableOptions }} 
            options available
          </option>
          <option v-for="(option, idx) in availableConfigurationOptions" :key="idx" :value="option"
            :disabled="!option.available">
              {{ option.label }}
              <!-- Replace {{ formatList(option.replaces) }} 
              with {{ formatList(option.weapon) }}
              for {{ option.cost }} points -->
          </option>
        </select>
        <label for="selectConfig">Configuration Options</label>
      </div>
      <button :disabled="!availableConfigurationOptions.length || !selectedOption" class="btn btn-outline-primary ms-2"
       @click="onSelect(selectedOption)">Apply</button>
       <button v-if="buildOptions.length" class="btn btn-outline-primary ms-2" @click="onClickReset">Reset</button>
      </div>
    </div>

    <div v-if="rolesForUnit.length > 1" class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
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


  <small v-if="devMode" class="d-print-none">
    <code>{{ unit }}</code>
  </small>
  <div v-if="devMode"  class="d-print-none">
    Configuration Options
    <small><code>{{ configurationOptions }}</code></small>
  </div>
  <div v-if="devMode"  class="d-print-none">
    Available Configuration Options
    <small><code>{{ availableConfigurationOptions }}</code></small>
  </div>

  <div class="border-bottom" />
</template>

<script setup lang="ts">
import UnitDetails from './UnitDetails.vue'

import { useDataStore } from "@/stores/data";
import { useSquadStore } from "@/stores/squad";
import { computed, ref, watch } from "vue";

import orderBy from 'lodash/orderBy'
import isArray from 'lodash/isArray'
import formatList from '@/utils/formatList';
import type { Configuration, Item, SquadUnit, Weapon } from '@/types/unit';
import isNil from 'lodash/isNil';
import { isNull, join } from 'lodash';

const devMode = false; // import.meta.env.DEV;

const emit = defineEmits(['update:unit']);

const props = defineProps<{
  unit: SquadUnit
}>();

const selectedWeapon = ref(null);
const selectedOption = ref(null);

const dataStore = useDataStore();
const squadStore = useSquadStore();

const unitType = computed(() => dataStore.getUnitByName(props.unit.name));

const toOption = ({ name, cost }: Item) => {
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

watch(selectedWeapon, async (weaponName) => {
  if (weaponName) {
    const weapon = weaponsForUnit.value.find(({ name }) => name === weaponName);
    if (weapon) squadStore.setWeapons(props.unit.id, [ weapon ])
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

const configurationOptions = computed(() => dataStore.getConfigurationOptionsForUnit(props.unit));
const availableConfigurationOptions = computed(() => {
  const currentWeapons = props.unit.weapons.map(({ name }) => name);

  // does the required list match the current weapon selection?
  const hasRequiredWeapons = ({ replaces } : Configuration) => {
    if (isArray(replaces)) {
      return replaces.reduce((all, s) => all && currentWeapons.includes(s), true);
    }
    return currentWeapons.includes(replaces);
  }

  const hasAll = (source: string[]|undefined, target: string[]): boolean => {
    if (!source) return true;

    const result = target.reduce((required, name) => {
      const idx = required.indexOf(name);
      if (idx > -1) required.splice(idx, 1);
      return required
    }, [...source]);
    return !result.length;
  }

  const hasAny = (source: string[]|undefined, target: string[]): boolean => {
    if (!source) return false;
    return target.reduce((found, name) => found || source.includes(name), false);
  }

  const isMelee = ({ melee, range }: Weapon): boolean => melee || isNull(range);
  
  const { role, weapons} = props.unit;

  const hasRole = ({ condition }: Configuration): boolean => 
    isNil(condition?.role) || condition?.role === role;
  const hasMeleeWeapon = ({ condition }: Configuration): boolean => 
    isNil(condition?.hasMeleeWeapon) || weapons.some(isMelee) === condition?.hasMeleeWeapon;
  const hasRequired = ({ condition }: Configuration): boolean => 
    isNil(condition?.requires) || hasAll(condition?.requires, weapons.map(({ name }) => name));
  const hasNoneOf = ({ condition }: Configuration): boolean =>
    isNil(condition?.not) || !hasAny(condition?.not, weapons.map(({ name }) => name));
  
  
  const formatRequirements = (list: string|string[]) => {
    if (!isArray(list)) return list;
    const countItems = list.reduce((acc, s) => {
      if (s in acc) {
        acc[s] += 1;
      } else {
        acc[s] = 1;
      }
      return acc;
    }, {});

    return formatList(Object.entries(countItems)
      .map(([s, n]) => n > 1 ? `${n}x${s}` : s));
  }

  return configurationOptions.value
    .map((option) => {
      const available = hasRequiredWeapons(option)
        && hasRequired(option) 
        && hasRole(option)
        && hasMeleeWeapon(option)
        && hasNoneOf(option);

      const label = [
        `Replace ${formatList(option.replaces)}`,
        `with ${formatRequirements(option.weapon)}`,
        option.condition?.requires ? `requires ${formatRequirements(option.condition.requires)}` : null,
        `(${option.cost})`,
      ];

      return {
        ...option,
        label: label.filter((s) => s > '').join(' '),
        available,
      };
    })

const numAvailableOptions = computed(() => availableConfigurationOptions.value.filter(({ available }) => available).length);

function onClickReset() {
  const [defaultOption] = buildOptions.value;
  selectBuildOption.value = defaultOption.value;
}

function onClickRemove() {
  if (props.unit) {
    squadStore.removeSquadMember(props.unit)
  }
}

function onSelect({ weapon, replaces }: Configuration) {
  squadStore.removeWeapons(props.unit, replaces);
  squadStore.addWeapons(props.unit, weapon);
  selectedOption.value = null;
}
</script>

<style scoped>
</style>