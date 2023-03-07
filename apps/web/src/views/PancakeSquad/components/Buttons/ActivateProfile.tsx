import { Button, NextLinkFromReactRouter } from '@offsideswap/uikit'
import { ContextApi } from '@offsideswap/localization'
import { UserStatusEnum } from 'views/OffsideSquad/types'

type ActivateProfileButtonProps = {
  t: ContextApi['t']
  userStatus: UserStatusEnum
}

const ActivateProfileButton: React.FC<React.PropsWithChildren<ActivateProfileButtonProps>> = ({ t, userStatus }) => (
  <>
    {(userStatus === UserStatusEnum.NO_PROFILE || userStatus === UserStatusEnum.UNCONNECTED) && (
      <Button as={NextLinkFromReactRouter} to="/create-profile" mr="4px">
        {t('Activate Profile')}
      </Button>
    )}
  </>
)

export default ActivateProfileButton
