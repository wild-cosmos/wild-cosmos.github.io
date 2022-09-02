import type { Unit } from "@/types/unit"

export default (unit: Unit): number => {
  return unit.cost + (unit.weapon?.cost ?? 0)
}
