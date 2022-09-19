<template>
  <h3 class="d-none d-print-block">
    {{ squadName }}
  </h3>
  <div class="row d-print-none ">
    <div class="col">
      <div class="form-floating">
        <input v-model="squadName" class="form-control">
        <label for="selectWeapon">Warband Name</label>
      </div>
    </div>
    <div class="col-auto">
      <button class="mt-2 btn btn-danger text-nowrap" :disabled="!squadStore.units.length" @click="onReset">
        <i class="bi-trash3" />
        Reset
      </button>
    </div>
  </div>

  <SquadMember v-for="(unit) in squadStore.units" :key="unit.id" :unit="unit" />

  <div class="toast-container position-fixed bottom-0 end-0 p-3 pb-5">
    <div v-for="{ text, variant, icon } in validationErrors" :key="text" role="alert"
      :class="['toast', 'fade show', `text-bg-${variant || 'warning'}`, 'mb-2']" aria-live="assertive"
      aria-atomic="true">
      <div class="toast-body">
        <div class="d-flex align-items-center">
          <h3 :class="['mb-0 me-2', icon ?? 'bi-exclamation-diamond']" />
          <div>{{ text }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="squadStore.units.length" class="d-flex justify-content-end my-3">
    <strong :class="{ 'text-nowrap': true, 'text-danger': squadStore.totalPoints > maxPoints }">Total {{
    squadStore.totalPoints
    }} Pts</strong>
  </div>

  <div class="d-print-none bg-light my-3 py-2 row">
    <div class="col-12 col-sm-auto">
      <SelectFaction v-model:faction="selectedFaction" class="mb-3 mb-sm-0" />
    </div>
    <div class="col-12 col-sm-auto">
      <div class="form-floating">
        <select id="selectUnit" v-model="selectedUnit" class="form-select" :disabled="!availableUnitOptions.length">
          <option v-if="selectedFaction === 'None'" disabled :value="null">Select Faction</option>
          <option v-else-if="!selectedUnit" disabled :value="null">Select Model</option>
          <option v-for="({ value, text }) in availableUnitOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectUnit">Model</label>
      </div>
    </div>
    <div class="col-auto">
      <button class="mt-2 btn btn-success text-nowrap" :disabled="!selectedUnit" @click="onAddSquadMember">
        <i class="bi-clipboard-plus" />
        Add Model to Roster
      </button>
    </div>
  </div>

  <div v-if="squadStore.units.length">
    <h3>Reference</h3>
    <WeaponsList v-if="uniqueWeapons.length" :weapons="uniqueWeapons" />
    <WargearList v-if="uniqueWargear.length" :wargear="uniqueWargear" />
  </div>
</template>

<script setup lang="ts">
import {
  computed, ref, watch, nextTick,
} from 'vue';
import { Toast } from 'bootstrap';
import { isString, orderBy, uniqBy } from 'lodash-es';
import SquadMember from '@/components/SquadMember.vue';
import SelectFaction from '@/components/SelectFaction.vue';
import WeaponsList from '../components/WeaponsList.vue';
import WargearList from '../components/WargearList.vue';

import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';
import type { Wargear, Weapon } from '@/types/unit';

const dataStore = useDataStore();
const squadStore = useSquadStore();

// const state = reactive({ selectedFaction: null as any});
const selectedUnit = ref(null);
const maxPoints = 100;

const selectedFaction = computed({
  get() { return squadStore.faction; },
  set(faction) {
    squadStore.faction = faction;
    selectedUnit.value = null;
  },
});

const squadName = computed({
  get() { return squadStore.name; },
  set(name) { squadStore.name = name; },
});

const availableUnits = computed(() => dataStore.getUnitsForFaction(squadStore.faction));

const availableUnitOptions = computed(() => {
  const options = availableUnits.value.map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }));
  return orderBy(options, ['text']);
});

const validationErrors = computed(() => {
  const errorList = [] as { text: string, icon?: string, variant?: string }[];

  if (squadStore.units.length) {
    errorList.push({
        text: `Total ${squadStore.totalPoints} points` 
          + (squadStore.totalPoints > maxPoints ? `, your Warband value is greater than ${maxPoints}` : ''),
        variant: squadStore.totalPoints > maxPoints ? 'danger' : 'success',
      });

    if (squadStore.units.length < 3) {
      errorList.push({ text: 'Your Warband must contain at least 3 models' });
    }

    const roles = squadStore.units.reduce((o, { role }) => {
      if (!role) return o;
      const key = role.toLowerCase();
      if (key in o) {
        o[key] += 1;
      } else {
        o[key] = 1;
      }
      return o;
    }, {
      leader: 0,
      core: 0,
      specialist: 0,
    } as { [key: string]: number });

    if (!roles.leader) {
      errorList.push({ text: 'Your Warband must have a Leader' });
    } else if (roles.leader !== 1) {
      errorList.push({ text: 'Your Warband cannot have more than one Leader' });
    }
    if (roles.specialist > roles.core) {
      errorList.push({ text: 'Your Warband cannot have more Specialist than Core models' });
    }
  }

  return errorList.slice(0, 2).map((e) => {
    return {
      ...e,
      icon: e.variant === 'success' ? 'bi-check-circle' : null,
    };
  });
});

watch(validationErrors, async (errorList) => {
  if (errorList.length) {
    nextTick(() => {
      const option: Partial<Toast.Options> = { autohide: false };
      const toastElList = document.querySelectorAll('.toast');
      toastElList.forEach((toastEl) => new Toast(toastEl, option));
    });
  }
});

const uniqueWeapons = computed(() => {
  const weaponsReference = squadStore.units.reduce((list, { weapons }) => {
    if (weapons) list.push(...weapons);
    return list;
  }, [] as Weapon[]);
  return orderBy(uniqBy(weaponsReference, 'name'), ['name']);
});

const uniqueWargear = computed(() => {
  const wargearReference = squadStore.units.reduce((list, { wargear }) => {
    if (wargear) list.push(...wargear);
    return list;
  }, [] as Wargear[]);
  return orderBy(uniqBy(wargearReference, 'name'), ['name']);
});

function onAddSquadMember() {
  const unit = availableUnits.value.find(({ name }) => name === selectedUnit.value);
  if (unit) squadStore.addSquadMember(unit);
}

function onReset() {
  squadStore.clear();
}
</script>
