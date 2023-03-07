import { useEffect, useState } from 'react'
import { Flex, useTooltip } from '@offsideswap/uikit'
import { useTranslation } from '@offsideswap/localization'
import CountdownCircle from './CountdownCircle'

const UpdateIndicator: React.FC<React.PropsWithChildren<{ isFetchingOffsideBunnies: boolean }>> = ({
  isFetchingOffsideBunnies,
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
    if (!isFetchingOffsideBunnies) {
      setSecondsRemaining(10)
    }
  }, [isFetchingOffsideBunnies])

  return (
    <Flex justifyContent="center" ref={targetRef}>
      <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={isFetchingOffsideBunnies} />
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default UpdateIndicator
