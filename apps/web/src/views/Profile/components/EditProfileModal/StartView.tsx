import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Button, Flex, InjectedModalProps, Message, MessageText } from '@spaceinvaders-swap/uikit'
import { getSpaceinvadersProfileAddress } from 'utils/addressHelpers'
import { useInva } from 'hooks/useContract'
import { useGetInvaBalance } from 'hooks/useTokenBalance'
import { useInvaEnable } from 'hooks/useInvaEnable'
import { useTranslation } from '@spaceinvaders-swap/localization'
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
  const { reader: invaContract } = useInva()
  const { profile } = useProfile()
  const { balance: invaBalance, fetchStatus } = useGetInvaBalance()
  const {
    costs: { numberInvaToUpdate, numberInvaToReactivate },
    isLoading: isProfileCostsLoading,
  } = useGetProfileCosts()
  const [needsApproval, setNeedsApproval] = useState(null)
  const minimumInvaRequired = profile?.isActive ? numberInvaToUpdate : numberInvaToReactivate
  const hasMinimumInvaRequired = fetchStatus === FetchStatus.Fetched && invaBalance.gte(minimumInvaRequired)
  const { handleEnable, pendingEnableTx } = useInvaEnable(new BigNumber(minimumInvaRequired.toString()))
  const [showInvaRequireFlow, setShowInvaRequireFlow] = useState(false)

  useEffect(() => {
    if (!isProfileCostsLoading && !hasMinimumInvaRequired && !showInvaRequireFlow) {
      setShowInvaRequireFlow(true)
    }
  }, [isProfileCostsLoading, hasMinimumInvaRequired, showInvaRequireFlow])

  /**
   * Check if the wallet has the required INVA allowance to change their profile pic or reactivate
   * If they don't, we send them to the approval screen first
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const approvalNeeded = await requiresApproval(
        invaContract,
        account,
        getSpaceinvadersProfileAddress(),
        minimumInvaRequired,
      )
      setNeedsApproval(approvalNeeded)
    }

    if (account && !isProfileCostsLoading) {
      checkApprovalStatus()
    }
  }, [account, minimumInvaRequired, setNeedsApproval, invaContract, isProfileCostsLoading])

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
                "Before editing your profile, please make sure you've claimed all the unspent INVA from previous IFOs!",
              )}
            </MessageText>
          </Message>
          {showInvaRequireFlow ? (
            <Flex mb="8px">
              <ApproveConfirmButtons
                isApproveDisabled={isProfileCostsLoading || hasMinimumInvaRequired}
                isApproving={pendingEnableTx}
                isConfirmDisabled={isProfileCostsLoading || !hasMinimumInvaRequired || needsApproval === null}
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
              disabled={isProfileCostsLoading || !hasMinimumInvaRequired || needsApproval === null}
            >
              {t('Change Profile Pic')}
            </Button>
          )}
          <DangerOutline width="100%" onClick={goToRemove}>
            {t('Remove Profile Pic')}
          </DangerOutline>
        </>
      ) : showInvaRequireFlow ? (
        <Flex mb="8px">
          <ApproveConfirmButtons
            isApproveDisabled={isProfileCostsLoading || hasMinimumInvaRequired}
            isApproving={pendingEnableTx}
            isConfirmDisabled={isProfileCostsLoading || !hasMinimumInvaRequired || needsApproval === null}
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
          disabled={isProfileCostsLoading || !hasMinimumInvaRequired || needsApproval === null}
        >
          {t('Reactivate Profile')}
        </Button>
      )}
    </Flex>
  )
}

export default StartPage
