<template>
  <div class="mt-3">
    <UnitDetails :unit="unit">
      <template #actions>
        <button class="d-print-none btn btn-sm btn-secondary me-2" @click="onClickDuplicate">
          <i class="bi-files" />
          Duplicate
        </button>
        <button class="d-print-none btn btn-sm btn-danger" @click="onClickRemove">
          <i class="bi-clipboard-x" />
          Remove
        </button>
      </template>
    </UnitDetails>
    <div class="d-print-none row py-2">
      <div v-if="availableConfigurationOptions.length" class="col-12 col-md-8 col-xl-6 mb-3 mb-sm-0">
        <div class="d-flex align-items-center">
          <div class="form-floating flex-grow-1">
            <select id="selectConfig" v-model="selectedOption" :disabled="!availableConfigurationOptions.length"
              class="form-select">
              <option :value="null" disabled>
                {{ numAvailableOptions }}
                options available
              </option>
              <option v-for="(option, idx) in availableConfigurationOptions" :key="idx" :value="option"
                :disabled="!option.available">
                {{ option.label }}
              </option>
            </select>
            <label for="selectConfig">Configuration Options</label>
          </div>
          <button :disabled="!availableConfigurationOptions.length || !selectedOption"
            class="btn btn-outline-primary ms-2" @click="onSelect(selectedOption)">
            <i class="bi-check-lg" />
            Apply
          </button>
          <button class="btn btn-outline-primary ms-2" @click="onClickReset">
            <i class="bi-x-lg" />
            Reset</button>
        </div>
      </div>

      <div v-if="rolesForUnit.length > 1" class="col-12 col-sm-6 col-md-4 mb-3 mb-sm-0">
        <div class="form-floating">
          <select v-model="selectedRole" class="form-select">
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
    <div v-if="devMode" class="d-print-none">
      Configuration Options
      <small><code>{{ configurationOptions }}</code></small>
    </div>
    <div v-if="devMode" class="d-print-none">
      Available Configuration Options
      <small><code>{{ availableConfigurationOptions }}</code></small>
    </div>
  </div>
  <div class="border-bottom" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import orderBy from 'lodash/orderBy';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';
import countBy from 'lodash/countBy';

import UnitDetails from './UnitDetails.vue';

import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';

import formatList from '@/utils/formatList';
import type {
  Configuration, Item, SquadUnit, Weapon,
} from '@/types/unit';
import { isString } from 'lodash';

const devMode = false; // import.meta.env.DEV;

const emit = defineEmits(['update:unit']);

const props = defineProps<{
  unit: SquadUnit
}>();

const selectedOption = ref(null);

const dataStore = useDataStore();
const squadStore = useSquadStore();

const unitType = computed(() => dataStore.getUnitByName(props.unit.name));

const toOption = ({ name, cost }: Item) => ({ value: name, text: `${name} (${cost})` });

const weaponsForUnit = computed(() => dataStore.getWeaponsForUnit(props.unit));

const wargearForUnit = computed(() => {
  const { wargear } = props.unit;
  if (wargear) {
    return Object.entries(wargear).map(([name, { cost }]) => ({ name, cost }));
  }
  return [];
});

const wargearOptions = computed(() => wargearForUnit.value.map(toOption));

const rolesForUnit = computed(() => {
  if (!unitType.value) return [];
  const { roles } = unitType.value;
  const options = isArray(roles) ? roles : [roles];
  return options;
});

const selectedRole = computed({
  get() {
    return props.unit.role;
  },
  set(role) {
    squadStore.setRole(props.unit.id, role);
  },
});

const configurationOptions = computed(() => dataStore.getConfigurationOptionsForUnit(props.unit));

const availableConfigurationOptions = computed(() => {
  const currentWeapons = (props.unit.weapons ?? [])
    .filter((weapon) => !!weapon)
    .map(({ name }) => name);
  const currentWargear = (props.unit.wargear ?? [])
    .filter((wargear) => !!wargear)
    .map(({ name }) => name);

  // does the required list match the current weapon selection?
  const hasRequiredWeapons = ({ replaces }: Configuration) => {
    if (!replaces) return true;
    if (isArray(replaces)) {
      return replaces.reduce((all, s) => all && currentWeapons.includes(s), true);
    }
    return currentWeapons.includes(replaces);
  };

  const hasRequiredWargear = ({ replaces }: Configuration) => {
    if (!replaces) return true;
    if (isArray(replaces)) {
      return replaces.reduce((all, s) => all && currentWargear.includes(s), true);
    }
    return currentWeapons.includes(replaces);
  };

  const hasAll = (source: string | string[] | undefined, target: string[]): boolean => {
    if (!source) return true;
    if (isString(source)) return hasAll([source], target);

    const result = target.reduce((required, name) => {
      const idx = required.indexOf(name);
      if (idx > -1) required.splice(idx, 1);
      return required;
    }, [...source]);
    return !result.length;
  };

  const hasAny = (source: string| string[] | undefined, target: string[]): boolean => {
    if (!source) return false;
    if (isString(source)) return hasAny([source], target);

    return source.reduce((hasMatch, w) => {
      if (hasMatch) return hasMatch;
      if (isArray(w)) {
        return target.reduce((r, n) => {
          const idx = r.indexOf(n);
          if (idx > -1) r.splice(idx, 1);
          return r;
        }, [...w]).length === 0;
      }
      return target.includes(w);
    }, false);
  };

  const hasEmptySlot = (source: Weapon[]): boolean => source.includes(null);

  const isMelee = ({ melee, range }: Weapon): boolean => !!melee || isNull(range);

  const { role, weapons, wargear } = props.unit;

  const hasRole = ({ condition }: Configuration): boolean => isNil(condition?.role) || condition?.role === role;
  const hasMeleeWeapon = ({ condition }: Configuration): boolean => isNil(condition?.hasMeleeWeapon) || weapons.some(isMelee) === condition?.hasMeleeWeapon;
  const hasRequired = ({ condition }: Configuration): boolean => isNil(condition?.requires)
    || hasAll(condition?.requires, weapons.map(({ name }) => name))
    || hasAll(condition?.requires, wargear.map(({ name }) => name));
  const hasItem = (item: Item) => !!item;

  const hasNoneOf = ({ condition }: Configuration): boolean => isNil(condition?.not)
    || !(hasAny(condition?.not, (weapons ?? []).filter(hasItem).map(({ name }) => name))
      || hasAny(condition?.not, (wargear ?? []).filter(hasItem).map(({ name }) => name)));
  const hasAnyOf = ({ condition }: Configuration) => isNil(condition?.any)
    || hasAny(condition?.any, weapons.map(({ name }) => name))
    || hasAny(condition?.any, wargear?.map(({ name }) => name))
    || hasEmptySlot(weapons);

  const formatRequirements = (list?: string | string[]) => {
    if (!isArray(list)) return list;
    const countItems = countBy(list);
    return formatList(Object.entries<number>(countItems)
      .map(([s, n]): string => (n > 1 ? `${n} x ${s}` : s)));
  };

  const isNullOrEmpty = (list?: string | string[] | undefined) => {
    if (!list) return true;
    if (isArray(list)) {
      if (!list.length || list[0] === 'Empty') return true;
    }
    return false;
  };
  const options = configurationOptions.value
    .filter(hasRole)
    .map((option) => {
      const available = (hasRequiredWeapons(option) || hasRequiredWargear(option))
        && hasRequired(option)
        && hasMeleeWeapon(option)
        && hasNoneOf(option)
        && hasAnyOf(option);

      const label = [
        isNullOrEmpty(option.replaces)
          ? `Add ${formatRequirements(option.weapon)}`
          : `Replace ${formatList(option.replaces)} with ${formatRequirements(option.weapon)}`,
        !isNullOrEmpty(option.condition?.requires) ? `requires ${formatRequirements(option.condition?.requires)}` : null,
        `(${option.cost})`,
      ];

      return {
        ...option,
        label: label.filter((s) => !!s).join(' '),
        sortOrder: label[0]?.substring(0, 7) !== 'Replace',
        available,
      };
    });
  return orderBy(options, ['sortOrder', 'label']);
});

const numAvailableOptions = computed(() => availableConfigurationOptions.value.filter(({ available }) => available).length);

function onClickReset() {
  squadStore.resetWargear(props.unit);
}

function onClickRemove() {
  if (props.unit) {
    squadStore.removeSquadMember(props.unit);
  }
}

function onClickDuplicate() {
  squadStore.duplicateSquadMember(props.unit);
}

function onSelect(option: Configuration | null) {
  if (option) {
    const { weapon, replaces, cost } = option;

    squadStore.removeWargear(props.unit, replaces);
    squadStore.addWargear(props.unit, weapon, cost);
    selectedOption.value = null;
  }
}
</script>

<style scoped>

</style>
