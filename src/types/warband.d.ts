declare interface Warband {
  id: number
  name: string | null
  fluff?: string
  models: SquadUnit[]
}

declare interface WarbandUpdate {
  name?: string
  fluff?: string
  models?: SquadUnit[]
}
