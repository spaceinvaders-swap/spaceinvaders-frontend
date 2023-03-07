import styled from 'styled-components'
import { Flex, Text, TooltipText, useTooltip, Box, Link, BalanceWithLoading } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import { useIfoCredit, useIfoCeiling } from 'state/pools/hooks'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { getIRotoWeekDisplay } from 'views/Pools/helpers'

const InlineLink = styled(Link)`
  display: inline;
`

const IfoRotoRow: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const credit = useIfoCredit()
  const ceiling = useIfoCeiling()
  const weeksDisplay = getIRotoWeekDisplay(ceiling)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>
        {t(
          'The number of iROTO equals the locked staking amount if the staking duration is longer than %weeks% weeks. If the staking duration is less than %weeks% weeks, it will linearly decrease based on the staking duration.',
          {
            weeks: weeksDisplay,
          },
        )}
      </Text>
      <InlineLink external href="https://docs.offsideswap.finance/products/ifo-initial-farm-offering/iroto">
        {t('Learn more about iROTO')}
      </InlineLink>
    </Box>,
    {
      placement: 'bottom-start',
    },
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText>
        <Text ref={targetRef} color="textSubtle" bold fontSize="12px">
          {t('iROTO')}
        </Text>
      </TooltipText>
      <BalanceWithLoading color="text" bold fontSize="16px" decimals={3} value={getBalanceNumber(credit)} />
    </Flex>
  )
}

export default IfoRotoRow
