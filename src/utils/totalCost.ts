export default (unit: Unit): number => {
  return unit.cost + (unit.weapon?.cost ?? 0)
}
