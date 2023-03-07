import { Address } from '../types'

export enum OffsideCollectionKey {
  OFFSIDE = 'offside',
  SQUAD = 'offsideSquad',
}

export type OffsideCollection = {
  name: string
  description?: string
  slug: string
  address: Address
}

export type OffsideCollections = {
  [key in OffsideCollectionKey]: OffsideCollection
}
