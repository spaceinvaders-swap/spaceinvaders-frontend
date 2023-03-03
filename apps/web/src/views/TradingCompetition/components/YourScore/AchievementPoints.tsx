import { Text, Flex, Image } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'

interface AchievementPointsProps {
  achievement: {
    image?: string
  }
  userPointReward: number | string
}

const AchievementPoints: React.FC<React.PropsWithChildren<AchievementPointsProps>> = ({
  achievement,
  userPointReward,
}) => {
  const { t } = useTranslation()

  return (
    <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
      {achievement?.image && <Image src={`/images/achievements/${achievement?.image}`} width={25} height={25} />}
      <Text fontSize="12px" color="textSubtle" textTransform="lowercase">
        + {userPointReward} {t('Points')}
      </Text>
    </Flex>
  )
}

export default AchievementPoints
