<template>
  <div class="d-flex align-items-center">
    <div class="form-floating flex-grow-1">
      <select id="selectWarband" v-model="selectedWarband" class="form-control">
        <template v-if="!selectedWarband">
          <option v-if="warbandOptions.length" disabled :value="null">
            Select existing Warband or create new one
          </option>
          <option v-else disabled :value="null">
            Create new Warband
          </option>
        </template>
        <option v-for="{ value, label } in warbandOptions" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
      <label for="selectWarband">Warband</label>
    </div>
    <button class="btn btn-success text-nowrap ms-2" @click="addWarband">
      <i class="bi bi-plus-lg" />
      New
    </button>
    <button :disabled="!warband" class="btn btn-danger text-nowrap ms-2" @click="deleteWarband">
      <i class="bi bi-trash3" />
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWarbandStore } from '@/stores/warband';

const emit = defineEmits(['update:warband']);

const props = defineProps<{
  warband : number | null
}>();

const warbandStore = useWarbandStore();

const warbandOptions = computed(() => warbandStore.warbands.map(({ id, name }) => ({
  value: id,
  label: name || '- Unnamed Warband -',
})));

const selectedWarband = computed({
  get() { return props.warband; },
  set(warband) { emit('update:warband', warband); },
});

const addWarband = () => {
  const { id } = warbandStore.add();
  selectedWarband.value = id;
};

const deleteWarband = () => {
  // confirm delete
  if (selectedWarband.value) {
    warbandStore.remove(selectedWarband.value);
    emit('update:warband', null);
  }
};
</script>
