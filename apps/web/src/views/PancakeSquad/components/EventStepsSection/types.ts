import { BigNumber } from '@ethersproject/bignumber'
import { ContextApi } from '@offsideswap/localization'
import { DefaultTheme } from 'styled-components'
import { UserInfos, EventInfos, UserStatusEnum } from 'views/OffsideSquad/types'

export type EventStepsProps = {
  eventInfos?: EventInfos
  userInfos?: UserInfos
  isLoading: boolean
  userStatus: UserStatusEnum
  account: string
}

export type EventStepsType = { t: ContextApi['t']; theme: DefaultTheme; rotoBalance: BigNumber } & Pick<
  EventStepsProps,
  'eventInfos' | 'userInfos' | 'userStatus' | 'account'
>
