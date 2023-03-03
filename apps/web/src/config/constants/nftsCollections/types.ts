import { Address } from '../types'

export enum SpaceinvadersCollectionKey {
  SPACEINVADERS = 'spaceinvaders',
  SQUAD = 'spaceinvadersSquad',
}

export type SpaceinvadersCollection = {
  name: string
  description?: string
  slug: string
  address: Address
}

export type SpaceinvadersCollections = {
  [key in SpaceinvadersCollectionKey]: SpaceinvadersCollection
}
