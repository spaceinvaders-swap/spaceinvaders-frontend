import { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { MaxUint256 } from '@ethersproject/constants'
import { Modal, Text, Flex, BalanceInput, Box, Button, LogoRoundIcon, useToast } from '@offsideswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@offsideswap/localization'
import { formatNumber, getBalanceAmount, getBalanceNumber } from '@offsideswap/utils/formatBalance'
import useTheme from 'hooks/useTheme'
import useTokenBalance from 'hooks/useTokenBalance'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useRoto, useFarmAuctionContract } from 'hooks/useContract'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ApproveConfirmButtons, { ButtonArrangement } from 'components/ApproveConfirmButtons'
import { ConnectedBidder, FetchStatus } from 'config/constants/types'
import { usePriceRotoBusd } from 'state/farms/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { bscTokens } from '@offsideswap/tokens'
import { requiresApproval } from 'utils/requiresApproval'

const StyledModal = styled(Modal)`
  & > div:nth-child(2) {
    padding: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 280px;
  }
`

const ExistingInfo = styled(Box)`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.dropdown};
`

const InnerContent = styled(Box)`
  padding: 24px;
`

interface PlaceBidModalProps {
  onDismiss?: () => void
  // undefined initialBidAmount is passed only if auction is not loaded
  // in this case modal will not be possible to open
  initialBidAmount?: number
  connectedBidder: ConnectedBidder
  refreshBidders: () => void
}

const PlaceBidModal: React.FC<React.PropsWithChildren<PlaceBidModalProps>> = ({
  onDismiss,
  initialBidAmount,
  connectedBidder,
  refreshBidders,
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { callWithGasPrice } = useCallWithGasPrice()

  const [bid, setBid] = useState('')
  const [isMultipleOfTen, setIsMultipleOfTen] = useState(false)
  const [isMoreThanInitialBidAmount, setIsMoreThanInitialBidAmount] = useState(false)
  const [userNotEnoughRoto, setUserNotEnoughRoto] = useState(false)
  const [errorText, setErrorText] = useState(null)

  const { balance: userRoto, fetchStatus } = useTokenBalance(bscTokens.roto.address)
  const userRotoBalance = getBalanceAmount(userRoto)

  const rotoPriceBusd = usePriceRotoBusd()
  const farmAuctionContract = useFarmAuctionContract()
  const { reader: rotoContractReader, signer: rotoContractApprover } = useRoto()

  const { toastSuccess } = useToast()

  const { bidderData } = connectedBidder
  const { amount, position } = bidderData
  const isFirstBid = amount.isZero()
  const isInvalidFirstBid = isFirstBid && !isMoreThanInitialBidAmount

  useEffect(() => {
    setIsMoreThanInitialBidAmount(parseFloat(bid) >= initialBidAmount)
    setIsMultipleOfTen(parseFloat(bid) % 10 === 0 && parseFloat(bid) !== 0)
    if (fetchStatus === FetchStatus.Fetched && userRotoBalance.lt(bid)) {
      setUserNotEnoughRoto(true)
    } else {
      setUserNotEnoughRoto(false)
    }
  }, [bid, initialBidAmount, fetchStatus, userRotoBalance])

  useEffect(() => {
    if (userNotEnoughRoto) {
      setErrorText(t('Insufficient ROTO balance'))
    } else if (!isMoreThanInitialBidAmount && isFirstBid) {
      setErrorText(t('First bid must be %initialBidAmount% ROTO or more.', { initialBidAmount }))
    } else if (!isMultipleOfTen) {
      setErrorText(t('Bid must be a multiple of 10'))
    } else {
      setErrorText(null)
    }
  }, [isMultipleOfTen, isMoreThanInitialBidAmount, userNotEnoughRoto, initialBidAmount, t, isFirstBid])

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        return requiresApproval(rotoContractReader, account, farmAuctionContract.address)
      },
      onApprove: () => {
        return callWithGasPrice(rotoContractApprover, 'approve', [farmAuctionContract.address, MaxUint256])
      },
      onApproveSuccess: async ({ receipt }) => {
        toastSuccess(
          t('Contract approved - you can now place your bid!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
        )
      },
      onConfirm: () => {
        const bidAmount = new BigNumber(bid).times(DEFAULT_TOKEN_DECIMAL).toString()
        return callWithGasPrice(farmAuctionContract, 'bid', [bidAmount])
      },
      onSuccess: async ({ receipt }) => {
        refreshBidders()
        onDismiss?.()
        toastSuccess(t('Bid placed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  const handleInputChange = (input: string) => {
    setBid(input)
  }

  const setPercentageValue = (percentage: number) => {
    const rounding = percentage === 1 ? BigNumber.ROUND_FLOOR : BigNumber.ROUND_CEIL
    const valueToSet = getBalanceAmount(userRoto.times(percentage)).div(10).integerValue(rounding).times(10)
    setBid(valueToSet.toString())
  }
  return (
    <StyledModal title={t('Place a Bid')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <ExistingInfo>
        <Flex justifyContent="space-between">
          <Text>{t('Your existing bid')}</Text>
          <Text>{t('%num% ROTO', { num: getBalanceNumber(amount).toLocaleString() })}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Your position')}</Text>
          <Text>{position ? `#${position}` : '-'}</Text>
        </Flex>
      </ExistingInfo>
      <InnerContent>
        <Flex justifyContent="space-between" alignItems="center" pb="8px">
          <Text>{t('Bid a multiple of 10')}</Text>
          <Flex>
            <LogoRoundIcon width="24px" height="24px" mr="4px" />
            <Text bold>ROTO</Text>
          </Flex>
        </Flex>
        {isFirstBid && (
          <Text pb="8px" small>
            {t('First bid must be %initialBidAmount% ROTO or more.', { initialBidAmount })}
          </Text>
        )}
        <BalanceInput
          isWarning={!isMultipleOfTen || isInvalidFirstBid}
          placeholder="0"
          value={bid}
          onUserInput={handleInputChange}
          currencyValue={
            rotoPriceBusd.gt(0) &&
            `~${bid ? rotoPriceBusd.times(new BigNumber(bid)).toNumber().toLocaleString() : '0.00'} USD`
          }
        />
        <Flex justifyContent="flex-end" mt="8px">
          <Text fontSize="12px" color="textSubtle" mr="8px">
            {t('Balance')}:
          </Text>
          <Text fontSize="12px" color="textSubtle">
            {formatNumber(userRotoBalance.toNumber(), 3, 3)}
          </Text>
        </Flex>
        {errorText && (
          <Text color="failure" textAlign="right" fontSize="12px">
            {errorText}
          </Text>
        )}
        <Flex justifyContent="space-between" mt="8px" mb="24px">
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(0.25)}
          >
            25%
          </Button>
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(0.5)}
          >
            50%
          </Button>
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(0.75)}
          >
            75%
          </Button>
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(1)}
          >
            <Text small color="currentColor" textTransform="uppercase">
              {t('Max')}
            </Text>
          </Button>
        </Flex>
        <Flex flexDirection="column">
          {account ? (
            <ApproveConfirmButtons
              isApproveDisabled={isApproved}
              isApproving={isApproving}
              isConfirmDisabled={
                !isMultipleOfTen ||
                getBalanceAmount(userRoto).lt(bid) ||
                isConfirmed ||
                isInvalidFirstBid ||
                userNotEnoughRoto
              }
              isConfirming={isConfirming}
              onApprove={handleApprove}
              onConfirm={handleConfirm}
              buttonArrangement={ButtonArrangement.SEQUENTIAL}
            />
          ) : (
            <ConnectWalletButton />
          )}
        </Flex>
        <Text color="textSubtle" small mt="24px">
          {t('If your bid is unsuccessful, you’ll be able to reclaim your ROTO after the auction.')}
        </Text>
      </InnerContent>
    </StyledModal>
  )
}

export default PlaceBidModal
