import { formatEther } from '@ethersproject/units'
import { getUnixTime, sub } from 'date-fns'
import { gql } from 'graphql-request'
import { GetStaticProps } from 'next'
import { SWRConfig } from 'swr'
import { getRotoVaultAddress } from 'utils/addressHelpers'
import { getRotoContract } from 'utils/contractHelpers'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { bitQueryServerClient, infoServerClient } from 'utils/graphql'
import Home from '../views/Home'

const IndexPage = ({ totalTx30Days, addressCount30Days, tvl }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          totalTx30Days,
          addressCount30Days,
          tvl,
        },
      }}
    >
      <Home />
    </SWRConfig>
  )
}

// Values fetched from TheGraph and BitQuery jan 24, 2022
const txCount = 54780336
const addressCount = 4425459

const tvl = 6082955532.115718

export const getStaticProps: GetStaticProps = async () => {
  const totalTxQuery = gql`
    query TotalTransactions($block: Block_height) {
      offsideFactory(block: $block) {
        totalTransactions
      }
    }
  `

  const days30Ago = sub(new Date(), { days: 30 })

  const results = {
    totalTx30Days: txCount,
    addressCount30Days: addressCount,
    tvl,
  }

  try {
    const [days30AgoBlock] = await getBlocksFromTimestamps([getUnixTime(days30Ago)])

    if (!days30AgoBlock) {
      throw new Error('No block found for 30 days ago')
    }

    const totalTx = await infoServerClient.request(totalTxQuery)
    const totalTx30DaysAgo = await infoServerClient.request(totalTxQuery, {
      block: {
        number: days30AgoBlock.number,
      },
    })

    if (
      totalTx?.offsideFactory?.totalTransactions &&
      totalTx30DaysAgo?.offsideFactory?.totalTransactions &&
      parseInt(totalTx.offsideFactory.totalTransactions) > parseInt(totalTx30DaysAgo.offsideFactory.totalTransactions)
    ) {
      results.totalTx30Days =
        parseInt(totalTx.offsideFactory.totalTransactions) - parseInt(totalTx30DaysAgo.offsideFactory.totalTransactions)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching total tx count', error)
    }
  }

  const usersQuery = gql`
    query userCount($since: ISO8601DateTime, $till: ISO8601DateTime) {
      ethereum(network: bsc) {
        dexTrades(exchangeName: { in: ["Offside", "Offside v2"] }, date: { since: $since, till: $till }) {
          count(uniq: senders)
        }
      }
    }
  `

  if (process.env.BIT_QUERY_HEADER) {
    try {
      const result = await bitQueryServerClient.request(usersQuery, {
        since: days30Ago.toISOString(),
        till: new Date().toISOString(),
      })
      if (result?.ethereum?.dexTrades?.[0]?.count) {
        results.addressCount30Days = result.ethereum.dexTrades[0].count
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        console.error('Error when fetching address count', error)
      }
    }
  }

  try {
    const result = await infoServerClient.request(gql`
      query tvl {
        offsideFactories(first: 1) {
          totalLiquidityUSD
        }
      }
    `)
    const roto = await (await fetch('https://farms-api.offsideswap.com/price/roto')).json()
    const { totalLiquidityUSD } = result.offsideFactories[0]
    const rotoVaultV2 = getRotoVaultAddress()
    const rotoContract = getRotoContract()
    const totalRotoInVault = await rotoContract.balanceOf(rotoVaultV2)
    results.tvl = parseFloat(formatEther(totalRotoInVault)) * roto.price + parseFloat(totalLiquidityUSD)
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
    }
  }

  return {
    props: results,
    revalidate: 60 * 60 * 24 * 30, // 30 days
  }
}

IndexPage.chains = []

export default IndexPage
