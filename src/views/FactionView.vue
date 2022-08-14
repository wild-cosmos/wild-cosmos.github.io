<script setup lang="ts">
import ListUnits from '@/components/ListUnits.vue';

defineProps<{
  faction: string
}>()

</script>

<template>
  <h1>{{ faction }}</h1>
  <ListUnits :faction="faction" />
</template>