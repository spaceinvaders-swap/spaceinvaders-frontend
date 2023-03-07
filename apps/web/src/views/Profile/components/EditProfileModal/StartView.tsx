import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Button, Flex, InjectedModalProps, Message, MessageText } from '@offsideswap/uikit'
import { getOffsideProfileAddress } from 'utils/addressHelpers'
import { useRoto } from 'hooks/useContract'
import { useGetRotoBalance } from 'hooks/useTokenBalance'
import { useRotoEnable } from 'hooks/useRotoEnable'
import { useTranslation } from '@offsideswap/localization'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { FetchStatus } from 'config/constants/types'
import { requiresApproval } from 'utils/requiresApproval'
import { useProfile } from 'state/profile/hooks'
import ProfileAvatarWithTeam from 'components/ProfileAvatarWithTeam'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { UseEditProfileResponse } from './reducer'

interface StartPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
  goToRemove: UseEditProfileResponse['goToRemove']
  goToApprove: UseEditProfileResponse['goToApprove']
}

const DangerOutline = styled(Button).attrs({ variant: 'secondary' })`
  border-color: ${({ theme }) => theme.colors.failure};
  color: ${({ theme }) => theme.colors.failure};
  margin-bottom: 24px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    border-color: ${({ theme }) => theme.colors.failure};
    opacity: 0.8;
  }
`

const AvatarWrapper = styled.div`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const StartPage: React.FC<React.PropsWithChildren<StartPageProps>> = ({ goToApprove, goToChange, goToRemove }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { reader: rotoContract } = useRoto()
  const { profile } = useProfile()
  const { balance: rotoBalance, fetchStatus } = useGetRotoBalance()
  const {
    costs: { numberRotoToUpdate, numberRotoToReactivate },
    isLoading: isProfileCostsLoading,
  } = useGetProfileCosts()
  const [needsApproval, setNeedsApproval] = useState(null)
  const minimumRotoRequired = profile?.isActive ? numberRotoToUpdate : numberRotoToReactivate
  const hasMinimumRotoRequired = fetchStatus === FetchStatus.Fetched && rotoBalance.gte(minimumRotoRequired)
  const { handleEnable, pendingEnableTx } = useRotoEnable(new BigNumber(minimumRotoRequired.toString()))
  const [showRotoRequireFlow, setShowRotoRequireFlow] = useState(false)

  useEffect(() => {
    if (!isProfileCostsLoading && !hasMinimumRotoRequired && !showRotoRequireFlow) {
      setShowRotoRequireFlow(true)
    }
  }, [isProfileCostsLoading, hasMinimumRotoRequired, showRotoRequireFlow])

  /**
   * Check if the wallet has the required ROTO allowance to change their profile pic or reactivate
   * If they don't, we send them to the approval screen first
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const approvalNeeded = await requiresApproval(
        rotoContract,
        account,
        getOffsideProfileAddress(),
        minimumRotoRequired,
      )
      setNeedsApproval(approvalNeeded)
    }

    if (account && !isProfileCostsLoading) {
      checkApprovalStatus()
    }
  }, [account, minimumRotoRequired, setNeedsApproval, rotoContract, isProfileCostsLoading])

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <AvatarWrapper>
        <ProfileAvatarWithTeam profile={profile} />
      </AvatarWrapper>
      {profile.isActive ? (
        <>
          <Message variant="warning" my="16px">
            <MessageText>
              {t(
                "Before editing your profile, please make sure you've claimed all the unspent ROTO from previous IFOs!",
              )}
            </MessageText>
          </Message>
          {showRotoRequireFlow ? (
            <Flex mb="8px">
              <ApproveConfirmButtons
                isApproveDisabled={isProfileCostsLoading || hasMinimumRotoRequired}
                isApproving={pendingEnableTx}
                isConfirmDisabled={isProfileCostsLoading || !hasMinimumRotoRequired || needsApproval === null}
                isConfirming={false}
                onApprove={handleEnable}
                onConfirm={needsApproval === true ? goToApprove : goToChange}
                confirmLabel={t('Change Profile Pic')}
              />
            </Flex>
          ) : (
            <Button
              width="100%"
              mb="8px"
              onClick={needsApproval === true ? goToApprove : goToChange}
              disabled={isProfileCostsLoading || !hasMinimumRotoRequired || needsApproval === null}
            >
              {t('Change Profile Pic')}
            </Button>
          )}
          <DangerOutline width="100%" onClick={goToRemove}>
            {t('Remove Profile Pic')}
          </DangerOutline>
        </>
      ) : showRotoRequireFlow ? (
        <Flex mb="8px">
          <ApproveConfirmButtons
            isApproveDisabled={isProfileCostsLoading || hasMinimumRotoRequired}
            isApproving={pendingEnableTx}
            isConfirmDisabled={isProfileCostsLoading || !hasMinimumRotoRequired || needsApproval === null}
            isConfirming={false}
            onApprove={handleEnable}
            onConfirm={needsApproval === true ? goToApprove : goToChange}
            confirmLabel={t('Reactivate Profile')}
          />
        </Flex>
      ) : (
        <Button
          width="100%"
          mb="8px"
          onClick={needsApproval === true ? goToApprove : goToChange}
          disabled={isProfileCostsLoading || !hasMinimumRotoRequired || needsApproval === null}
        >
          {t('Reactivate Profile')}
        </Button>
      )}
    </Flex>
  )
}

export default StartPage
