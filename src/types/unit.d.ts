export interface Faction {
    abilities: Array<Ability>,
    units: Array<Unit>,
    weapons: Array<Weapon>,
    wargear: Array<Wargear>
}

export interface Ability {
    faction: string;
    name: string;
    cost: number;
}

export interface Unit {
    faction: string;
    name: string;
    cost: number;
    mv: Array<number>;
    bs: number;
    cs: number;
    df: number;
    lf: number;
    si: number;
    ld: number;
    roles: Array<string>;
    type: string | Array<string>;
    abilities: Array<string>;
    weapons: Array<string>;
    weapon: Weapon;
}

export interface Wargear {
    faction: string;
    type: string;
    name: string;
    cost: number;
    notes: string;
    usedBy: Array<string>;
}

export interface Weapon extends Wargear {
    melee: WeaponStats;
    range: number;
    a: number;
    ap: Array<number>;
    dm: number;
}

export interface WeaponStats {
  a: number;
  ap: Array<number>;
  dm: number;
  notes?: string;
}