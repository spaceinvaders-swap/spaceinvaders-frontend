import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'
import { useInva } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useProfile } from 'state/profile/hooks'
import { getSpaceinvadersProfileAddress } from 'utils/addressHelpers'
import { formatBigNumber } from '@spaceinvaders-swap/utils/formatBalance'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveInvaPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveInvaPage: React.FC<React.PropsWithChildren<ApproveInvaPageProps>> = ({ goToChange, onDismiss }) => {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const {
    costs: { numberInvaToUpdate, numberInvaToReactivate },
  } = useGetProfileCosts()
  const { signer: invaContract } = useInva()

  if (!profile) {
    return null
  }

  const cost = profile.isActive ? numberInvaToUpdate : numberInvaToReactivate

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return invaContract.approve(getSpaceinvadersProfileAddress(), cost.mul(2).toString())
    })
    if (receipt?.status) {
      goToChange()
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigNumber(cost)} INVA</Text>
      </Flex>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        width="100%"
        mb="8px"
        onClick={handleApprove}
      >
        {t('Enable')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveInvaPage
