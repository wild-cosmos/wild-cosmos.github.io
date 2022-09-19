export interface Faction {
  abilities?: Ability[];
  configuration?: Configuration[];
  models: { [key: string] : Unit };
  units?: Unit[];
  wargear?: Wargear[];
  weapons?: Weapon[];
  wargearList?: { [key: string]: Item[] };
}

export interface Ability {
  faction: string;
  name: string;
  cost: number;
}

interface BaseUnit {
  faction: string;
  name: string;
  cost: number;
  mv: number[];
  bs: number;
  cs: number;
  df: number;
  lf: number;
  si: number;
  ld: number;
  abilities: string[];
}
export interface Unit extends BaseUnit {
  roles: string[];
  type: string | string[];
  wargear?: string[];
  wargearList?: string[];
  weapons?: string[];
  // options?: BuildOptions[];
  // optionalWargear?: string[];
}

export interface SquadUnit extends BaseUnit {
  id: number;
  role: string;
  type: string | string[];
  weapons: Weapon[];
  wargear: Wargear[];
}

export interface BuildOptions {
  cost: number;
  weapons?: string[];
  wargear?: string[];
}

export interface Item {
  name: string;
  cost: number;
}

export interface Wargear extends Item {
  faction: string;
  type: string;
  hidden?: boolean;
  notes?: string;
}

export interface Weapon extends Wargear, WeaponStats {
  melee?: WeaponStats;
  combi?: string[];
  // range: number | number[];
  // a: number;
  // ap: number[];
  // dm: number;
  ammo?: boolean;
  hidden?: boolean;
}

export interface WeaponStats {
  range: number | number[];
  a: number;
  ap: number[];
  dm: number | number[];
  notes?: string;
}

export interface Configuration {
  weapon: string | string[];
  replaces: string | string[];
  condition?: Condition;
  cost: number;
  usedBy: string | string[];
}

interface Condition {
  role?: string | string[];
  hasMeleeWeapon?: boolean;
  requires?: string[];
  replaces?: string[];
  not?: string[];
  any?: string[];
  only?: string[];
  ability?: string[];
  limit?: number;
  modelLimit?: number;
  warbandLimit?: number;
}

export interface WargearList {
  name?: string;
  weapons: Weapon[];
  wargear: Wargear[];
}
