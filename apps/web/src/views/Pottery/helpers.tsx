import BigNumber from 'bignumber.js'
import { PotteryDepositStatus } from 'state/types'

const calculateSecondsRemaining = (today, daysToFri) => {
  // Get milliseconds to noon friday
  const fridayNoon = new Date(+today)
  fridayNoon.setUTCDate(fridayNoon.getDate() + daysToFri)
  fridayNoon.setUTCHours(12, 0, 0, 0)

  // Round up remaining
  const secondsRemaining = Math.ceil((fridayNoon.getTime() - today.getTime()) / 1000)
  return secondsRemaining
}

export const remainTimeToNextFriday = (): number => {
  // Get current date and time
  const today = new Date()

  // Get number of days to Friday
  const dayNum = today.getDay()
  let daysToFri = 5 - (dayNum <= 5 ? dayNum : dayNum - 7)

  const secondsRemaining = calculateSecondsRemaining(today, daysToFri)
  if (secondsRemaining <= 0) {
    daysToFri = 5 - (dayNum - 7)
    return calculateSecondsRemaining(today, daysToFri)
  }

  return secondsRemaining
}

interface CalculateInvaAmount {
  status: PotteryDepositStatus
  previewRedeem: string
  shares: string
  totalSupply: BigNumber
  totalLockInva: BigNumber
}

export const calculateInvaAmount = ({
  status,
  previewRedeem,
  shares,
  totalSupply,
  totalLockInva,
}: CalculateInvaAmount): BigNumber => {
  if (status === PotteryDepositStatus.LOCK) {
    return new BigNumber(shares).div(totalSupply).times(totalLockInva)
  }

  return new BigNumber(previewRedeem)
}
