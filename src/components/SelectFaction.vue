<template>
  <div class="form-floating">
    <select id="faction" v-model="selectedFaction" class="form-select"
      aria-label="Selected faction"
      placeholder="Faction">
      <option v-if="allowNull || !selectedFaction" :value="null">
        Select Faction
      </option>
      <option v-for="({ text, value, disabled }) in factions" :key="value" :value="value"
        :disabled="disabled">
        {{ text }}
      </option>
    </select>
    <label for="faction">Faction</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { orderBy } from 'lodash-es';
import { useDataStore } from '@/stores/data';

export default defineComponent({
  props: {
    faction: { type: String, default: null },
    validFactions: { type: Array, default: () => ([]) },
    allowNull: { type: Boolean, default: false },
  },
  emits: ['update:faction'],
  setup() {
    const { getUniqueFactions } = storeToRefs(useDataStore());
    return { getUniqueFactions };
  },
  computed: {
    selectedFaction: {
      get() {
        return this.faction;
      },
      set(faction: string) {
        this.$emit('update:faction', faction);
      },
    },
    factions() {
      const options = this.getUniqueFactions
        .map((name) => ({
          value: name,
          text: name,
          disabled: this.validFactions?.length > 0 && !this.validFactions.includes(name),
        }));
      return orderBy(options, ['text']);
    },
  },
});
</script>
