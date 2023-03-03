import styled from 'styled-components'
import { Flex, Box } from '@spaceinvaders-swap/uikit'
import { GreyCard } from 'components/Card'
import { usePotteryData } from 'state/pottery/hook'
import { calculateInvaAmount } from 'views/Pottery/helpers'
import BigNumber from 'bignumber.js'
import { BIG_ONE } from '@spaceinvaders-swap/utils/bigNumber'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { useAccount } from 'wagmi'
import YourDeposit from '../YourDeposit'
import WalletNotConnected from './WalletNotConnected'
import AvailableWithdraw from './AvailableWithdraw'
import PrizeToBeClaimed from './PrizeToBeClaimed'
import CardFooter from './CardFooter'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
`

const Claim: React.FC<React.PropsWithChildren> = () => {
  const { address: account } = useAccount()
  const { publicData, userData } = usePotteryData()

  const allDeposit = userData.withdrawAbleData
    .map((data) => {
      const { status, shares, previewRedeem, totalSupply, totalLockInva } = data
      return calculateInvaAmount({
        status,
        previewRedeem,
        shares,
        totalSupply: new BigNumber(totalSupply),
        totalLockInva: new BigNumber(totalLockInva),
      })
    })
    .reduce((previousValue, currentValue) => previousValue.plus(currentValue), BIG_ONE)

  return (
    <Box>
      {account ? (
        <Container>
          <GreyCard>
            <SubgraphHealthIndicator inline subgraphName="spaceinvaders-swap/pottery" />
            <Flex justifyContent="space-between" mb="20px">
              <YourDeposit depositBalance={allDeposit} />
            </Flex>
            {userData.withdrawAbleData.map((data) => (
              <AvailableWithdraw key={data.id} withdrawData={data} />
            ))}
            <PrizeToBeClaimed userData={userData} />
          </GreyCard>
        </Container>
      ) : (
        <WalletNotConnected />
      )}
      <CardFooter account={account} publicData={publicData} userData={userData} />
    </Box>
  )
}

export default Claim
