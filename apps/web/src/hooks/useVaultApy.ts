import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { WeiPerEther } from '@ethersproject/constants'
import _toString from 'lodash/toString'
import { BLOCKS_PER_YEAR } from 'config'
import masterChefAbi from 'config/abi/masterchef.json'
import { useCallback, useMemo } from 'react'
import { useInvaVault } from 'state/pools/hooks'
import useSWRImmutable from 'swr/immutable'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from '@spaceinvaders-swap/utils/bigNumber'
import { BOOST_WEIGHT, DURATION_FACTOR, MAX_LOCK_DURATION } from 'config/constants/pools'
import { multicallv2 } from '../utils/multicall'

const masterChefAddress = getMasterChefAddress()

// default
const DEFAULT_PERFORMANCE_FEE_DECIMALS = 2

const PRECISION_FACTOR = BigNumber.from('1000000000000')

const getFlexibleApy = (
  totalInvaPoolEmissionPerYear: FixedNumber,
  pricePerFullShare: FixedNumber,
  totalShares: FixedNumber,
) =>
  totalInvaPoolEmissionPerYear
    .mulUnsafe(FixedNumber.from(WeiPerEther))
    .divUnsafe(pricePerFullShare)
    .divUnsafe(totalShares)
    .mulUnsafe(FixedNumber.from(100))

const _getBoostFactor = (boostWeight: BigNumber, duration: number, durationFactor: BigNumber) => {
  return FixedNumber.from(boostWeight)
    .mulUnsafe(FixedNumber.from(Math.max(duration, 0)))
    .divUnsafe(FixedNumber.from(durationFactor))
    .divUnsafe(FixedNumber.from(PRECISION_FACTOR))
}

const getLockedApy = (flexibleApy: string, boostFactor: FixedNumber) =>
  FixedNumber.from(flexibleApy).mulUnsafe(boostFactor.addUnsafe(FixedNumber.from('1')))

const invaPoolPID = 0

export function useVaultApy({ duration = MAX_LOCK_DURATION }: { duration?: number } = {}) {
  const {
    totalShares = BIG_ZERO,
    pricePerFullShare = BIG_ZERO,
    fees: { performanceFeeAsDecimal } = { performanceFeeAsDecimal: DEFAULT_PERFORMANCE_FEE_DECIMALS },
  } = useInvaVault()

  const totalSharesAsEtherBN = useMemo(() => FixedNumber.from(totalShares.toString()), [totalShares])
  const pricePerFullShareAsEtherBN = useMemo(() => FixedNumber.from(pricePerFullShare.toString()), [pricePerFullShare])

  const { data: totalInvaPoolEmissionPerYear } = useSWRImmutable('masterChef-total-inva-pool-emission', async () => {
    const calls = [
      {
        address: masterChefAddress,
        name: 'invaPerBlock',
        params: [false],
      },
      {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [invaPoolPID],
      },
      {
        address: masterChefAddress,
        name: 'totalSpecialAllocPoint',
      },
    ]

    const [[specialFarmsPerBlock], invaPoolInfo, [totalSpecialAllocPoint]] = await multicallv2({
      abi: masterChefAbi,
      calls,
    })

    const invaPoolSharesInSpecialFarms = FixedNumber.from(invaPoolInfo.allocPoint).divUnsafe(
      FixedNumber.from(totalSpecialAllocPoint),
    )
    return FixedNumber.from(specialFarmsPerBlock)
      .mulUnsafe(FixedNumber.from(BLOCKS_PER_YEAR))
      .mulUnsafe(invaPoolSharesInSpecialFarms)
  })

  const flexibleApy = useMemo(
    () =>
      totalInvaPoolEmissionPerYear &&
      !pricePerFullShareAsEtherBN.isZero() &&
      !totalSharesAsEtherBN.isZero() &&
      getFlexibleApy(totalInvaPoolEmissionPerYear, pricePerFullShareAsEtherBN, totalSharesAsEtherBN).toString(),
    [pricePerFullShareAsEtherBN, totalInvaPoolEmissionPerYear, totalSharesAsEtherBN],
  )

  const boostFactor = useMemo(() => _getBoostFactor(BOOST_WEIGHT, duration, DURATION_FACTOR), [duration])

  const lockedApy = useMemo(() => {
    return flexibleApy && getLockedApy(flexibleApy, boostFactor).toString()
  }, [boostFactor, flexibleApy])

  const getBoostFactor = useCallback(
    (adjustDuration: number) => _getBoostFactor(BOOST_WEIGHT, adjustDuration, DURATION_FACTOR),
    [],
  )

  const flexibleApyNoFee = useMemo(() => {
    if (flexibleApy && performanceFeeAsDecimal) {
      const rewardPercentageNoFee = _toString(1 - performanceFeeAsDecimal / 100)

      return FixedNumber.from(flexibleApy).mulUnsafe(FixedNumber.from(rewardPercentageNoFee)).toString()
    }

    return flexibleApy
  }, [flexibleApy, performanceFeeAsDecimal])

  return {
    flexibleApy: flexibleApyNoFee,
    lockedApy,
    getLockedApy: useCallback(
      (adjustDuration: number) => flexibleApy && getLockedApy(flexibleApy, getBoostFactor(adjustDuration)).toString(),
      [flexibleApy, getBoostFactor],
    ),
    boostFactor: useMemo(() => boostFactor.addUnsafe(FixedNumber.from('1')), [boostFactor]),
    getBoostFactor: useCallback(
      (adjustDuration: number) => getBoostFactor(adjustDuration).addUnsafe(FixedNumber.from('1')),
      [getBoostFactor],
    ),
  }
}
