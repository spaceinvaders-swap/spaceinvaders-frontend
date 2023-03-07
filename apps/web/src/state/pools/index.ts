import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import keyBy from 'lodash/keyBy'
import poolsConfig from 'config/constants/pools'
import {
  PoolsState,
  SerializedPool,
  SerializedVaultFees,
  SerializedRotoVault,
  SerializedLockedVaultUser,
  PublicIfoData,
  SerializedVaultUser,
  SerializedLockedRotoVault,
} from 'state/types'
import { getPoolApr } from 'utils/apr'
import { BIG_ZERO } from '@offsideswap/utils/bigNumber'
import rotoAbi from 'config/abi/roto.json'
import { getRotoVaultAddress, getRotoFlexibleSideVaultAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { bscTokens } from '@offsideswap/tokens'
import { isAddress } from 'utils'
import { getBalanceNumber } from '@offsideswap/utils/formatBalance'
import { bscRpcProvider } from 'utils/providers'
import { getPoolsPriceHelperLpFiles } from 'config/constants/priceHelperLps/index'
import fetchFarms from '../farms/fetchFarms'
import getFarmsPrices from '../farms/getFarmsPrices'
import {
  fetchPoolsBlockLimits,
  fetchPoolsProfileRequirement,
  fetchPoolsStakingLimits,
  fetchPoolsTotalStaking,
} from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
} from './fetchPoolsUser'
import { fetchPublicVaultData, fetchVaultFees, fetchPublicFlexibleSideVaultData } from './fetchVaultPublic'
import { getTokenPricesFromFarm } from './helpers'
import { resetUserState } from '../global/actions'
import { fetchUserIfoCredit, fetchPublicIfoData } from './fetchUserIfo'
import { fetchVaultUser, fetchFlexibleSideVaultUser } from './fetchVaultUser'

export const initialPoolVaultState = Object.freeze({
  totalShares: null,
  totalLockedAmount: null,
  pricePerFullShare: null,
  totalRotoInVault: null,
  fees: {
    performanceFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  },
  userData: {
    isLoading: true,
    userShares: null,
    rotoAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
    credit: null,
    locked: null,
    lockStartTime: null,
    lockEndTime: null,
    userBoostedShare: null,
    lockedAmount: null,
    currentOverdueFee: null,
    currentPerformanceFee: null,
  },
  creditStartBlock: null,
})

export const initialIfoState = Object.freeze({
  credit: null,
  ceiling: null,
})

const initialState: PoolsState = {
  data: [...poolsConfig],
  userDataLoaded: false,
  rotoVault: initialPoolVaultState,
  ifo: initialIfoState,
  rotoFlexibleSideVault: initialPoolVaultState,
}

const rotoVaultAddress = getRotoVaultAddress()

export const fetchRotoPoolPublicDataAsync = () => async (dispatch, getState) => {
  const farmsData = getState().farms.data
  const prices = getTokenPricesFromFarm(farmsData)

  const rotoPool = poolsConfig.filter((p) => p.sousId === 0)[0]

  const stakingTokenAddress = isAddress(rotoPool.stakingToken.address)
  const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

  const earningTokenAddress = isAddress(rotoPool.earningToken.address)
  const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0

  dispatch(
    setPoolPublicData({
      sousId: 0,
      data: {
        stakingTokenPrice,
        earningTokenPrice,
      },
    }),
  )
}

export const fetchRotoPoolUserDataAsync = (account: string) => async (dispatch) => {
  const allowanceCall = {
    address: bscTokens.roto.address,
    name: 'allowance',
    params: [account, rotoVaultAddress],
  }
  const balanceOfCall = {
    address: bscTokens.roto.address,
    name: 'balanceOf',
    params: [account],
  }
  const rotoContractCalls = [allowanceCall, balanceOfCall]
  const [[allowance], [stakingTokenBalance]] = await multicallv2({ abi: rotoAbi, calls: rotoContractCalls })

  dispatch(
    setPoolUserData({
      sousId: 0,
      data: {
        allowance: new BigNumber(allowance.toString()).toJSON(),
        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).toJSON(),
      },
    }),
  )
}

export const fetchPoolsPublicDataAsync =
  (currentBlockNumber: number, chainId: number) => async (dispatch, getState) => {
    try {
      const [blockLimits, totalStakings, profileRequirements, currentBlock] = await Promise.all([
        fetchPoolsBlockLimits(),
        fetchPoolsTotalStaking(),
        fetchPoolsProfileRequirement(),
        currentBlockNumber ? Promise.resolve(currentBlockNumber) : bscRpcProvider.getBlockNumber(),
      ])

      const blockLimitsSousIdMap = keyBy(blockLimits, 'sousId')
      const totalStakingsSousIdMap = keyBy(totalStakings, 'sousId')

      const priceHelperLpsConfig = getPoolsPriceHelperLpFiles(chainId)
      const activePriceHelperLpsConfig = priceHelperLpsConfig.filter((priceHelperLpConfig) => {
        return (
          poolsConfig
            .filter(
              (pool) => pool.earningToken.address.toLowerCase() === priceHelperLpConfig.token.address.toLowerCase(),
            )
            .filter((pool) => {
              const poolBlockLimit = blockLimitsSousIdMap[pool.sousId]
              if (poolBlockLimit) {
                return poolBlockLimit.endBlock > currentBlock
              }
              return false
            }).length > 0
        )
      })
      const poolsWithDifferentFarmToken =
        activePriceHelperLpsConfig.length > 0 ? await fetchFarms(priceHelperLpsConfig, chainId) : []
      const farmsData = getState().farms.data
      const bnbBusdFarm =
        activePriceHelperLpsConfig.length > 0
          ? farmsData.find((farm) => farm.token.symbol === 'BUSD' && farm.quoteToken.symbol === 'WBNB')
          : null
      const farmsWithPricesOfDifferentTokenPools = bnbBusdFarm
        ? getFarmsPrices([bnbBusdFarm, ...poolsWithDifferentFarmToken], chainId)
        : []

      const prices = getTokenPricesFromFarm([...farmsData, ...farmsWithPricesOfDifferentTokenPools])

      const liveData = poolsConfig.map((pool) => {
        const blockLimit = blockLimitsSousIdMap[pool.sousId]
        const totalStaking = totalStakingsSousIdMap[pool.sousId]
        const isPoolEndBlockExceeded =
          currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
        const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

        const stakingTokenAddress = isAddress(pool.stakingToken.address)
        const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

        const earningTokenAddress = isAddress(pool.earningToken.address)
        const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
        const apr = !isPoolFinished
          ? getPoolApr(
              stakingTokenPrice,
              earningTokenPrice,
              getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
              parseFloat(pool.tokenPerBlock),
            )
          : 0

        const profileRequirement = profileRequirements[pool.sousId] ? profileRequirements[pool.sousId] : undefined

        return {
          ...blockLimit,
          ...totalStaking,
          profileRequirement,
          stakingTokenPrice,
          earningTokenPrice,
          apr,
          isFinished: isPoolFinished,
        }
      })

      dispatch(setPoolsPublicData(liveData))
    } catch (error) {
      console.error('[Pools Action] error when getting public data', error)
    }
  }

export const fetchPoolsStakingLimitsAsync = () => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  try {
    const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)

    const stakingLimitData = poolsConfig.map((pool) => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId }
      }
      const { stakingLimit, numberBlocksForUserLimit } = stakingLimits[pool.sousId] || {
        stakingLimit: BIG_ZERO,
        numberBlocksForUserLimit: 0,
      }
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
        numberBlocksForUserLimit,
      }
    })

    dispatch(setPoolsPublicData(stakingLimitData))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchPoolsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    const [allowances, stakingTokenBalances, stakedBalances, pendingRewards] = await Promise.all([
      fetchPoolsAllowance(account),
      fetchUserBalances(account),
      fetchUserStakeBalances(account),
      fetchUserPendingRewards(account),
    ])

    const userData = poolsConfig.map((pool) => ({
      sousId: pool.sousId,
      allowance: allowances[pool.sousId],
      stakingTokenBalance: stakingTokenBalances[pool.sousId],
      stakedBalance: stakedBalances[pool.sousId],
      pendingReward: pendingRewards[pool.sousId],
    }))
    return userData
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateUserAllowance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserAllowance', async ({ sousId, account }) => {
  const allowances = await fetchPoolsAllowance(account)
  return { sousId, field: 'allowance', value: allowances[sousId] }
})

export const updateUserBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserBalance', async ({ sousId, account }) => {
  const tokenBalances = await fetchUserBalances(account)
  return { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }
})

export const updateUserStakedBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserStakedBalance', async ({ sousId, account }) => {
  const stakedBalances = await fetchUserStakeBalances(account)
  return { sousId, field: 'stakedBalance', value: stakedBalances[sousId] }
})

export const updateUserPendingReward = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserPendingReward', async ({ sousId, account }) => {
  const pendingRewards = await fetchUserPendingRewards(account)
  return { sousId, field: 'pendingReward', value: pendingRewards[sousId] }
})

export const fetchRotoVaultPublicData = createAsyncThunk<SerializedLockedRotoVault>(
  'rotoVault/fetchPublicData',
  async () => {
    const publicVaultInfo = await fetchPublicVaultData()
    return publicVaultInfo
  },
)

export const fetchRotoFlexibleSideVaultPublicData = createAsyncThunk<SerializedRotoVault>(
  'rotoFlexibleSideVault/fetchPublicData',
  async () => {
    const publicVaultInfo = await fetchPublicFlexibleSideVaultData()
    return publicVaultInfo
  },
)

export const fetchRotoVaultFees = createAsyncThunk<SerializedVaultFees>('rotoVault/fetchFees', async () => {
  const vaultFees = await fetchVaultFees(getRotoVaultAddress())
  return vaultFees
})

export const fetchRotoFlexibleSideVaultFees = createAsyncThunk<SerializedVaultFees>(
  'rotoFlexibleSideVault/fetchFees',
  async () => {
    const vaultFees = await fetchVaultFees(getRotoFlexibleSideVaultAddress())
    return vaultFees
  },
)

export const fetchRotoVaultUserData = createAsyncThunk<SerializedLockedVaultUser, { account: string }>(
  'rotoVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchVaultUser(account)
    return userData
  },
)

export const fetchIfoPublicDataAsync = createAsyncThunk<PublicIfoData>('ifoVault/fetchIfoPublicDataAsync', async () => {
  const publicIfoData = await fetchPublicIfoData()
  return publicIfoData
})

export const fetchUserIfoCreditDataAsync = (account: string) => async (dispatch) => {
  try {
    const credit = await fetchUserIfoCredit(account)
    dispatch(setIfoUserCreditData(credit))
  } catch (error) {
    console.error('[Ifo Credit Action] Error fetching user Ifo credit data', error)
  }
}
export const fetchRotoFlexibleSideVaultUserData = createAsyncThunk<SerializedVaultUser, { account: string }>(
  'rotoFlexibleSideVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchFlexibleSideVaultUser(account)
    return userData
  },
)

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolPublicData: (state, action) => {
      const { sousId } = action.payload
      const poolIndex = state.data.findIndex((pool) => pool.sousId === sousId)
      state.data[poolIndex] = {
        ...state.data[poolIndex],
        ...action.payload.data,
      }
    },
    setPoolUserData: (state, action) => {
      const { sousId } = action.payload
      state.data = state.data.map((pool) => {
        if (pool.sousId === sousId) {
          return { ...pool, userDataLoaded: true, userData: action.payload.data }
        }
        return pool
      })
    },
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      const livePoolsSousIdMap = keyBy(livePoolsData, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
    },
    // IFO
    setIfoUserCreditData: (state, action) => {
      const credit = action.payload
      state.ifo = { ...state.ifo, credit }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map(({ userData, ...pool }) => {
        return { ...pool }
      })
      state.userDataLoaded = false
      state.rotoVault = { ...state.rotoVault, userData: initialPoolVaultState.userData }
      state.rotoFlexibleSideVault = { ...state.rotoFlexibleSideVault, userData: initialPoolVaultState.userData }
    })
    builder.addCase(
      fetchPoolsUserDataAsync.fulfilled,
      (
        state,
        action: PayloadAction<
          { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[]
        >,
      ) => {
        const userData = action.payload
        const userDataSousIdMap = keyBy(userData, 'sousId')
        state.data = state.data.map((pool) => ({
          ...pool,
          userDataLoaded: true,
          userData: userDataSousIdMap[pool.sousId],
        }))
        state.userDataLoaded = true
      },
    )
    builder.addCase(fetchPoolsUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
    // Vault public data that updates frequently
    builder.addCase(fetchRotoVaultPublicData.fulfilled, (state, action: PayloadAction<SerializedLockedRotoVault>) => {
      state.rotoVault = { ...state.rotoVault, ...action.payload }
    })
    builder.addCase(
      fetchRotoFlexibleSideVaultPublicData.fulfilled,
      (state, action: PayloadAction<SerializedRotoVault>) => {
        state.rotoFlexibleSideVault = { ...state.rotoFlexibleSideVault, ...action.payload }
      },
    )
    // Vault fees
    builder.addCase(fetchRotoVaultFees.fulfilled, (state, action: PayloadAction<SerializedVaultFees>) => {
      const fees = action.payload
      state.rotoVault = { ...state.rotoVault, fees }
    })
    builder.addCase(fetchRotoFlexibleSideVaultFees.fulfilled, (state, action: PayloadAction<SerializedVaultFees>) => {
      const fees = action.payload
      state.rotoFlexibleSideVault = { ...state.rotoFlexibleSideVault, fees }
    })
    // Vault user data
    builder.addCase(fetchRotoVaultUserData.fulfilled, (state, action: PayloadAction<SerializedLockedVaultUser>) => {
      const userData = action.payload
      state.rotoVault = { ...state.rotoVault, userData }
    })
    // IFO
    builder.addCase(fetchIfoPublicDataAsync.fulfilled, (state, action: PayloadAction<PublicIfoData>) => {
      const { ceiling } = action.payload
      state.ifo = { ...state.ifo, ceiling }
    })
    builder.addCase(
      fetchRotoFlexibleSideVaultUserData.fulfilled,
      (state, action: PayloadAction<SerializedVaultUser>) => {
        const userData = action.payload
        state.rotoFlexibleSideVault = { ...state.rotoFlexibleSideVault, userData }
      },
    )
    builder.addMatcher(
      isAnyOf(
        updateUserAllowance.fulfilled,
        updateUserBalance.fulfilled,
        updateUserStakedBalance.fulfilled,
        updateUserPendingReward.fulfilled,
      ),
      (state, action: PayloadAction<{ sousId: number; field: string; value: any }>) => {
        const { field, value, sousId } = action.payload
        const index = state.data.findIndex((p) => p.sousId === sousId)

        if (index >= 0) {
          state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
        }
      },
    )
  },
})

// Actions
export const { setPoolsPublicData, setPoolPublicData, setPoolUserData, setIfoUserCreditData } = PoolsSlice.actions

export default PoolsSlice.reducer
