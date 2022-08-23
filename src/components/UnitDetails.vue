<template>
    <h3 class="mt-3">
        {{ unit.name }}
    </h3>
    <table class="table table-sm">
        <thead>
            <tr>
                <th>Mv</th>
                <th>BS</th>
                <th>CS</th>
                <th>Df</th>
                <th>Lf</th>
                <th>Ld</th>
                <th>Role</th>
                <th>Type</th>
                <th>Pts</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="stat">
                    {{ formatStat(unit.mv, '"') }}
                </td>
                <td class="stat">
                    {{ formatStat(unit.bs, "+") }}
                </td>
                <td class="stat">
                    {{ formatStat(unit.cs, "+") }}
                </td>
                <td class="stat">
                    {{ formatStat(unit.df, "+") }}
                </td>
                <td class="stat">
                    {{ formatStat(unit.lf, "+") }}
                </td>
                <td class="stat">
                    {{ formatStat(unit.ld, "+") }}
                </td>
                <td>{{ unit.role }}</td>
                <td>{{ unit.type }}</td>
                <td>{{ unit.totalCost() }} Pts</td>
            </tr>
        </tbody>
    </table>
    <table class="table table-sm">
        <tbody>
            <tr>
                <th>Wargear</th>
                <td>
                    <span v-for="(wargear) in allWargear" :key="wargear" class="d-print-none badge bg-primary me-1">
                        {{ wargear }}
                    </span>
                    <span v-for="(wargear) in allWargear" :key="wargear" class="d-none d-print-inline me-1">
                        {{ wargear }}
                    </span>
                </td>
            </tr>
            <tr>
                <th>Abilities</th>
                <td>
                    <span v-for="(ability) in unit.abilities" :key="ability" class="d-print-none badge bg-primary me-1">
                        {{ ability }}
                    </span>
                    <span v-for="(ability) in unit.abilities" :key="ability" class="d-none d-print-inline me-1">
                        {{ ability }}
                    </span>

                </td>
            </tr>
            <tr>
                <th>Faction</th>
                <td>{{ unit.faction }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import orderBy from 'lodash/orderBy'
import isArray from 'lodash/isArray'
import formatStat from '@/utils/formatStat'
import { useDataStore } from "@/stores/data";

const props = defineProps<{
    unit: any
}>();

const unit = computed(() => {
    return props.unit
})

const dataStore = useDataStore();

const weaponsForUnit = computed(() => {
    if (props.unit.weapons) {
        return props.unit.weapons.map((w: string) => {
            if (isArray(w)) {
                const { name, cost } = w.map((name) => dataStore.getWeapon(name))
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

const allWargear = computed(() => {
    const wargear = [];
    if (props.unit.weapon) wargear.push(props.unit.weapon.name)
    // if (props.unit.wargear) wargear.push(props.unit.wargear.name)
    return wargear
})
</script>


<style>
td.stat {
    width: 4rem;
}
</style>