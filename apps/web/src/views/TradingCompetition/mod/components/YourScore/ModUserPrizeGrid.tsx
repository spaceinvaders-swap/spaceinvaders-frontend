import { BlockIcon, CheckmarkCircleIcon, Flex, Text } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'

import styled from 'styled-components'
import { getRewardGroupAchievements, useModCompetitionRewards } from '../../../helpers'
import { UserTradingInformation } from '../../../types'
import { BoldTd, StyledPrizeTable, Td } from '../../../components/StyledPrizeTable'
import { modPrizes } from '../../../../../config/constants/trading-competition/prizes'
import UserPrizeGridDollar from '../../../components/YourScore/UserPrizeGridDollar'
import AchievementPoints from '../../../components/YourScore/AchievementPoints'
import { useCanClaimSpecialNFT } from '../../../useCanClaimSpecialNFT'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const ModUserPrizeGrid: React.FC<React.PropsWithChildren<{ userTradingInformation?: UserTradingInformation }>> = ({
  userTradingInformation,
}) => {
  const { t } = useTranslation()
  const { userRewardGroup, userRotoRewards, userDarRewards, userPointReward, canClaimNFT } = userTradingInformation
  const canClaimSpecialNFT = useCanClaimSpecialNFT()
  const { rotoReward, darReward, dollarValueOfTokensReward } = useModCompetitionRewards({
    userRotoRewards,
    userDarRewards,
  })

  const achievement = getRewardGroupAchievements(modPrizes, userRewardGroup, userPointReward)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('Token Prizes')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
          <th>{t('Bunny Helmet')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{rotoReward.toFixed(4)} ROTO</Text>
              <Text bold>{darReward.toFixed(4)} DAR</Text>
              <UserPrizeGridDollar dollarValueOfTokensReward={dollarValueOfTokensReward} />
            </Flex>
          </BoldTd>
          <Td>
            <AchievementPoints achievement={achievement} userPointReward={userPointReward} />
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
          <Td>{canClaimSpecialNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default ModUserPrizeGrid
