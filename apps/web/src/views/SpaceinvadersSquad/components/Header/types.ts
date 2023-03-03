import { EventInfos, UserInfos, UserStatusEnum } from 'views/SpaceinvadersSquad/types'

export type SpaceinvadersSquadHeaderType = {
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
