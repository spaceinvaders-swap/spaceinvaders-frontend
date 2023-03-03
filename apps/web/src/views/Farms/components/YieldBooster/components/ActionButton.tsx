import {
  Button,
  Heading,
  Text,
  ButtonProps,
  HelpIcon,
  Flex,
  TooltipText,
  useTooltip,
  LinkExternal,
  useMatchBreakpoints,
} from '@spaceinvaders-swap/uikit'
import _isEmpty from 'lodash/isEmpty'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@spaceinvaders-swap/localization'

const Container = styled.div`
  margin-right: 4px;
`

interface ActionButtonPropsType extends ButtonProps {
  title: string
  description: string
  button?: ReactNode
}

const BoosterTooltip = () => {
  const { t } = useTranslation()

  return (
    <>
      {t(
        `Boost multiplier is calculated based on the staking conditions from both Farms and fixed-term INVA syrup pool and will be automatically updated upon user actions.`,
      )}
      <LinkExternal
        href="https://docs.spaceinvaders-swap.finance/products/yield-farming/binva/faq#how-are-the-binva-multipliers-calculated"
        external
      >
        {t('Learn More')}
      </LinkExternal>
    </>
  )
}

const ActionButton: React.FC<ActionButtonPropsType> = ({ title, description, button, ...props }) => {
  const { isMobile } = useMatchBreakpoints()
  let btn = null

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<BoosterTooltip />, {
    placement: 'top',
    ...(isMobile && { hideTimeout: 1500 }),
  })

  if (button) {
    btn = button
  } else if (!_isEmpty(props)) {
    btn = <Button {...props} />
  }

  return (
    <>
      <Container>
        <Flex>
          <Heading mr="4px">{title}</Heading>
          <TooltipText ref={targetRef}>
            <HelpIcon width="20px" height="20px" />
          </TooltipText>
          {tooltipVisible && tooltip}
        </Flex>

        <Text color="textSubtle" fontSize="12px">
          {description}
        </Text>
      </Container>
      {btn}
    </>
  )
}

export default ActionButton
