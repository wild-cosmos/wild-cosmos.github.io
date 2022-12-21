import type { SquadUnit } from '@/types/unit';

export default (unit: SquadUnit): number => unit.weapons
  ?.reduce((total: number, weapon) => total + (weapon?.cost ?? 0), unit.cost) ?? 0;
