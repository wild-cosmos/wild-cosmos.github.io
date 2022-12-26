export interface Faction {
  abilities?: Ability[] | string[]
  configuration?: Configuration[]
  models: { [key: string]: Unit }
  units?: Unit[]
  wargear?: Wargear[]
  weapons?: Weapon[]
  wargearList?: { [key: string]: Item[] }
}

export interface Ability {
  faction: string
  name: string
  description?: string
  cost?: number
}

export interface Configuration {
  weapon: string | string[]
  replaces: string | string[]
  condition?: Condition
  cost: number
  usedBy: string | string[]
}

interface Condition {
  role?: string | string[]
  hasMeleeWeapon?: boolean
  requires?: string[]
  replaces?: string[]
  not?: string[]
  any?: string[]
  only?: string[]
  ability?: string[]
  limit?: number
  modelLimit?: number
  warbandLimit?: number
}
