import { useEffect, useState } from 'react'
import { Flex, useTooltip } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'
import CountdownCircle from './CountdownCircle'

const UpdateIndicator: React.FC<React.PropsWithChildren<{ isFetchingSpaceinvadersBunnies: boolean }>> = ({
  isFetchingSpaceinvadersBunnies,
}) => {
  const { t } = useTranslation()
  const [secondsRemaining, setSecondsRemaining] = useState(10)
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Items in the table update every 10 seconds'), {
    placement: 'auto',
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!isFetchingSpaceinvadersBunnies) {
      setSecondsRemaining(10)
    }
  }, [isFetchingSpaceinvadersBunnies])

  return (
    <Flex justifyContent="center" ref={targetRef}>
      <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={isFetchingSpaceinvadersBunnies} />
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default UpdateIndicator
