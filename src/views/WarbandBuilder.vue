<template>
  <h3 class="d-none d-print-block">
    {{ squadName }}
  </h3>
  <div class="row d-print-none align-items-center">
    <div class="col-12 col-sm mb-2 mb-sm-0">
      <SelectWarband v-model:warband="selectedWarband" />
    </div>
    <div v-if="selectedWarband" class="col-12 col-sm-4">
      <div class="form-floating">
        <input id="warbandName" v-model="squadName" class="form-control">
        <label for="warbandName">Warband Name</label>
      </div>
    </div>
  </div>

  <div v-if="selectedWarband">
    <SquadMember v-for="(model) in squadStore.models" :key="model.id" :unit="model" />

    <div class="toast-container d-print-none position-fixed bottom-0 end-0 p-3 pb-5">
      <div v-for="{ text, variant, icon } in validationErrors" :key="text" role="alert"
        :class="['toast', 'fade show', `text-bg-${variant || 'warning'}`, 'mb-2']" aria-live="assertive"
        aria-atomic="true">
        <div class="toast-body">
          <div class="d-flex align-items-center">
            <i :class="['fs-3 mb-0 me-2', icon ?? 'bi-exclamation-diamond']" />
            <div>{{ text }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="squadStore.models.length" class="d-flex justify-content-end my-3">
      <strong :class="{ 'text-nowrap': true, 'text-danger': squadStore.totalPoints > maxPoints }">Total {{
          squadStore.totalPoints
      }} Pts</strong>
    </div>

    <div class="d-print-none bg-light my-3 py-2 row align-items-center">
      <div class="col-12 col-sm-6 col-md-4">
        <SelectFaction v-model:faction="selectedFaction" :valid-factions="validListFactions" class="mb-2 mb-md-0" />
      </div>
      <div class="col-12 col-sm-6 col-md-4 mb-2 mb-md-0">
        <div class="form-floating">
          <select id="selectUnit" v-model="selectedModel" class="form-select" :disabled="!availableModelOptions.length">
            <option v-if="!selectedModel" disabled :value="null">
              Select Model
            </option>
            <option v-for="({ value, text }) in availableModelOptions" :key="value" :value="value">
              {{ text }}
            </option>
          </select>
          <label for="selectUnit">Model</label>
        </div>
      </div>
      <div class="col-auto d-flex flex-nowrap">
        <button type="button" class="btn btn-success text-nowrap" :disabled="!selectedModel" @click="onAddSquadMember">
          <i class="bi bi-clipboard-plus" />
          Add Model
        </button>
        <button type="button" class="ms-2 btn btn-danger text-nowrap" :disabled="!squadStore.models.length"
          @click="onReset">
          <i class="bi bi-arrow-counterclockwise" />
          Reset
        </button>
      </div>
    </div>
    <div v-if="squadStore.models.length">
      <h3>Reference</h3>
      <WeaponsList v-if="uniqueWeapons.length" :weapons="uniqueWeapons" />
      <WargearList v-if="uniqueWargear.length" :wargear="uniqueWargear" />
      <AbilityList v-if="uniqueAbilities.length" :items="uniqueAbilities" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, ref, watch, nextTick,
} from 'vue';
import { Toast } from 'bootstrap';
import { isArray, orderBy, uniqBy } from 'lodash-es';
import SquadMember from '@/components/SquadMember.vue';
import SelectFaction from '@/components/SelectFaction.vue';
import { useDataStore } from '@/stores/data';
import { useSquadStore } from '@/stores/squad';
import type { Wargear, Weapon } from '@/types/unit';
import type { Ability } from '@/types/faction';
import AbilityList from '../components/AbilityList.vue';
import WeaponsList from '../components/WeaponsList.vue';
import WargearList from '../components/WargearList.vue';

import SelectWarband from '../components/SelectWarband.vue';

const dataStore = useDataStore();
const squadStore = useSquadStore();

// const state = reactive({ selectedFaction: null as any});
const selectedModel = ref(null);
const maxPoints = 100;

const selectedFaction = computed({
  get() { return squadStore.faction; },
  set(faction) {
    squadStore.faction = faction;
    selectedModel.value = null;
  },
});

const selectedWarband = computed({
  get() { return squadStore?.id; },
  set(id) { squadStore.selectWarband(id); },
});

const squadName = computed({
  get() { return squadStore.name; },
  set(name) { squadStore.setName(name); },
});

const validListFactions = computed(() => squadStore.models.reduce((validFactions, { faction }) => {
  const factions: string[] = isArray(faction) ? faction : [faction];
  validFactions.push(...factions.filter((f) => !validFactions.includes(f)));
  return validFactions;
}, [] as string[]));

const availableModels = computed(() => dataStore.getModelsForFaction(squadStore.faction));

const availableModelOptions = computed(() => {
  const options = availableModels.value.map(({ name, cost }) => ({ value: name, text: `${name} (${cost})` }));
  return orderBy(options, ['text']);
});

const validationErrors = computed(() => {
  const errorList = [] as { text: string, icon?: string, variant?: string }[];

  if (squadStore.models.length) {
    if (squadStore.models.length < 3) {
      errorList.push({ text: 'Your Warband must contain at least 3 models' });
    }

    // Check models all from valid faction(s)
    const listFactions = squadStore.models.reduce((validFactions, { name, faction }) => {
      const factions: string[] = isArray(faction) ? faction : [faction];

      if (!validFactions.length) return [...factions];

      if (!factions.reduce((valid, f) => valid || validFactions.includes(f), false)) {
        errorList.push({ text: `${name} is not allowed`, variant: 'danger' });
      }
      return validFactions.filter((f) => factions.includes(f));
    }, [] as string[]);

    const roles = squadStore.models.reduce((o, { role }) => {
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

    errorList.push({
      text: `Total ${squadStore.totalPoints} points${squadStore.totalPoints > maxPoints ? `, your Warband value is greater than ${maxPoints}` : ''}`,
      variant: squadStore.totalPoints > maxPoints ? 'danger' : 'success',
    });
  }

  return errorList.slice(0, 2).map((e) => ({
    ...e,
    icon: e.variant === 'success' ? 'bi-check-circle' : null,
  }));
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

const uniqueAbilities = computed(() => {
  const abilityReference = squadStore.models.reduce((list, { abilities }) => {
    if (abilities) list.push(...abilities.map((name) => ({ name })));
    return list;
  }, [] as Ability[]);

  return orderBy(uniqBy(abilityReference, 'name'), ['name']);
});

const uniqueWeapons = computed(() => {
  const weaponsReference = squadStore.models.reduce((list, { weapons }) => {
    if (weapons) list.push(...weapons);
    return list;
  }, [] as Weapon[]);
  return orderBy(uniqBy(weaponsReference, 'name'), ['name']);
});

const uniqueWargear = computed(() => {
  const wargearReference = squadStore.models.reduce((list, { wargear }) => {
    if (wargear) list.push(...wargear);
    return list;
  }, [] as Wargear[]);
  return orderBy(uniqBy(wargearReference, 'name'), ['name']);
});

function onAddSquadMember() {
  const model = availableModels.value.find(({ name }) => name === selectedModel.value);
  if (model) squadStore.addSquadMember(model);
}

function onReset() {
  squadStore.clear();
}
</script>
