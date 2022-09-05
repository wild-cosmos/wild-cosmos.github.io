export interface Faction {
    abilities?: Ability[];
    configuration?: Configuration[]; 
    units?: Unit[];
    wargear?: Wargear[];
    weapons?: Weapon[];
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
    // wargear?: Wargear[];
    // weapons: Weapon[];
    options?: BuildOptions[];
    optionalWargear?: string[];
}

export interface SquadUnit extends BaseUnit
{
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
    name: string;
    cost: number;
    notes: string;
    usedBy: string[];
}

export interface Weapon extends Wargear {
    melee: WeaponStats;
    combi?: string[];
    range: number|number[];
    a: number;
    ap: number[];
    dm: number;
}

export interface WeaponStats {
  range: number|number[];
  a: number;
  ap: number[];
  dm: number|number[];
  notes?: string;
}

export interface Configuration {
  weapon: string|string[];
  replaces: string|string[];
  condition?: Condition;
  cost: number;
  usedBy: string|string[];
}

interface Condition {
  role?: string|string[];
  hasMeleeWeapon?: boolean;
}