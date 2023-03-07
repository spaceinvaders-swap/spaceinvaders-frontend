import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import { useRoto } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useProfile } from 'state/profile/hooks'
import { getOffsideProfileAddress } from 'utils/addressHelpers'
import { formatBigNumber } from '@offsideswap/utils/formatBalance'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveRotoPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveRotoPage: React.FC<React.PropsWithChildren<ApproveRotoPageProps>> = ({ goToChange, onDismiss }) => {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const {
    costs: { numberRotoToUpdate, numberRotoToReactivate },
  } = useGetProfileCosts()
  const { signer: rotoContract } = useRoto()

  if (!profile) {
    return null
  }

  const cost = profile.isActive ? numberRotoToUpdate : numberRotoToReactivate

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return rotoContract.approve(getOffsideProfileAddress(), cost.mul(2).toString())
    })
    if (receipt?.status) {
      goToChange()
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigNumber(cost)} ROTO</Text>
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

export default ApproveRotoPage
