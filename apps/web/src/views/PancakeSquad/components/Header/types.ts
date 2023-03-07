import { EventInfos, UserInfos, UserStatusEnum } from 'views/OffsideSquad/types'

export type OffsideSquadHeaderType = {
  account: string
  isLoading: boolean
  eventInfos?: EventInfos
  userInfos?: UserInfos
  userStatus: UserStatusEnum
}

export enum ButtonsEnum {
  ACTIVATE,
  BUY,
  MINT,
  END,
  NONE,
}
