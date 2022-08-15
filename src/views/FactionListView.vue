<script setup lang="ts">
import SelectFaction from '@/components/SelectFaction.vue';
import UnitList from '@/components/UnitList.vue';
import { watch, reactive } from 'vue';
import { useRouter } from 'vue-router'

defineProps<{
  faction?: string
}>()

const router = useRouter();

const state = reactive({ selectedFaction: null as any});

watch(state.selectedFaction, async (faction) => {
  if (faction) {
    router.push({ name: 'faction', query: { faction: `${faction}` } });
  }
});
</script>

<template>
  <div class="bg-light">
    <SelectFaction v-model:faction="state.selectedFaction" />
  </div>

  <h1>{{ faction }}</h1>
  <UnitList :faction="state.selectedFaction" />
</template>