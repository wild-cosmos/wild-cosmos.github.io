import type { SquadUnit } from "@/types/unit"

export default (unit: SquadUnit): number => {
  return unit.cost 
    + (unit.weapons?.reduce((total: number, { cost = 0 }) => total + cost, 0) ?? 0)
}
