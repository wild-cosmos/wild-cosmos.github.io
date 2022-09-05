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
      <button class="mt-2 btn btn-danger text-nowrap" @click="onReset">
        Reset
      </button>
    </div>
  </div>

  <SquadMember v-for="(unit) in squadStore.units" :key="unit.id" :unit="unit" />

  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div v-for="error in validationErrors" :key="error" class="toast fade show text-bg-warning mb-2" role="alert"
      aria-live="assertive" aria-atomic="true">
      <div class="toast-body">
        <div class="d-flex align-items-center">
          <h3 class="mb-0 me-2 bi bi-exclamation-diamond" />
          <div>{{ error }}</div>
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
    <div class="col-12 col-sm-6 col-md-4">
      <SelectFaction v-model:faction="selectedFaction" class="mb-3 mb-sm-0" />
    </div>
    <div class="col-12 col-sm-6 col-md-4">
      <div class="form-floating">
        <select id="selectUnit" v-model="selectedUnit" class="form-control">
          <option v-for="({ value, text }) in availableUnitOptions" :key="value" :value="value">
            {{ text }}
          </option>
        </select>
        <label for="selectUnit">Model</label>
      </div>
    </div>
    <div class="col">
      <button class="mt-2 btn btn-success text-nowrap" :disabled="!selectedUnit" @click="onAddSquadMember">
        Add Model to Roster
      </button>
    </div>
  </div>

  <div v-if="squadStore.units.length">
    <h3>Reference</h3>
    <WeaponsList v-if="uniqueWeapons.length" :weapons="uniqueWeapons" />
    <WargearList :wargear="uniqueWargear" />
  </div>
</template>

<script setup lang="ts">
import {
  computed, ref, watch, nextTick,
} from 'vue';
import { Toast } from 'bootstrap';
import orderBy from 'lodash/orderBy';
import uniqueBy from 'lodash/uniqBy';
import SquadMember from '@/components/SquadMember.vue';
import SelectFaction from '@/components/SelectFaction.vue';
import WeaponsList from '../components/WeaponsList.vue';
import WargearList from '../components/WargearList.vue';

import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';

const dataStore = useDataStore();
const squadStore = useSquadStore();

// const state = reactive({ selectedFaction: null as any});

const selectedFaction = computed({
  get() { return squadStore.faction; },
  set(faction) { squadStore.faction = faction; },
});

const squadName = computed({
  get() { return squadStore.name; },
  set(name) { squadStore.name = name; },
});

const selectedUnit = ref(null);
const maxPoints = 100;

const availableUnits = computed(() => dataStore.getUnitsForFaction(squadStore.faction));

const availableUnitOptions = computed(() => {
  const options = availableUnits.value.map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }));
  return orderBy(options, ['text']);
});

const validationErrors = computed(() => {
  const errorList = [];

  if (squadStore.units.length) {
    if (squadStore.totalPoints > maxPoints) {
      errorList.push(`Your Warband value is greater than ${maxPoints}`);
    }

    const roles = squadStore.units.reduce((o, { role }) => {
      if (!role) return o;
      if (role in o) {
        o[role] += 1;
      } else {
        o[role] = 1;
      }
      return o;
    }, {});

    if (!roles.Leader) {
      errorList.push('Your Warband must have a Leader');
    } else if (roles.Leader !== 1) {
      errorList.push('Your Warband cannot have more than one Leader');
    }
  }

  return errorList;
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
    list.push(...weapons);
    return list;
  }, []);
  return orderBy(uniqueBy(weaponsReference, 'name'), ['name']);
});

const uniqueWargear = computed(() => {
  const wargearReference = squadStore.units.reduce((list, { wargear }) => {
    list.push(...wargear);
    return list;
  }, []);
  return orderBy(uniqueBy(wargearReference, 'name'), ['name']);
});

function onAddSquadMember() {
  const unit = availableUnits.value.find(({ name }) => name === selectedUnit.value);
  if (unit) squadStore.addSquadMember(unit);
}

function onReset() {
  squadStore.clear();
}
</script>
