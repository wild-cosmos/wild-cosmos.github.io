export interface Warband {
  id: number
  name: string | null
  fluff?: string
  models: SquadUnit[]
}

export interface WarbandUpdate {
  name?: string
  fluff?: string
  models?: SquadUnit[]
}
