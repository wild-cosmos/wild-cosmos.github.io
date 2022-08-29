interface Faction {
    abilities: Array<Ability>,
    units: Array<Unit>,
    weapons: Array<Weapon>,
    wargear: Array<Wargear>
}

interface Ability {
    faction: string;
    name: string;
    cost: number;
}

interface Unit {
    faction: string;
    name: string;
    cost: number;
    mv: Array<string>;
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

interface Wargear {
    type: string;
    name: string;
    cost: number;
    notes: string;
    usedBy: Array<string>;
}

interface Weapon extends Wargear {
    range: number;
    a: number;
    ap: Array<number>;
    dm: number;
}
