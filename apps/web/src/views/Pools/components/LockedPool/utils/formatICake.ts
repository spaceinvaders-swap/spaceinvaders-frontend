import BigNumber from 'bignumber.js'

interface FormatiRoto {
  lockedAmount: any
  duration: number
  ceiling: BigNumber
}

export default function formatiRoto({ lockedAmount, duration, ceiling }: FormatiRoto) {
  const durationAsBn = new BigNumber(duration)
  if (durationAsBn.gte(ceiling)) {
    return new BigNumber(lockedAmount).toNumber()
  }

  if (durationAsBn.lt(ceiling) && durationAsBn.gte(0)) {
    return durationAsBn.times(lockedAmount).div(ceiling).toNumber()
  }

  return 0
}
