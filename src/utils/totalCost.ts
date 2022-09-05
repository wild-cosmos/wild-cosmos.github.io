import type { SquadUnit } from '@/types/unit';

export default (unit: SquadUnit): number => unit.cost
    + (unit.weapons?.reduce((total: number, { cost = 0 }) => total + cost, 0) ?? 0);
