import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Text, Select, OptionProps } from '@spaceinvaders-swap/uikit'
import { useGetCollection } from 'state/nftMarket/hooks'
import { useTranslation } from '@spaceinvaders-swap/localization'
import Container from 'components/Layout/Container'
import { isAddress } from 'utils'
import { spaceinvadersBunniesAddress } from '../../constants'
import SpaceinvadersBunniesCollectionNfts from './SpaceinvadersBunniesCollectionNfts'
import CollectionWrapper from './CollectionWrapper'

const Items = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const [sortBy, setSortBy] = useState('updatedAt')
  const { t } = useTranslation()
  const collection = useGetCollection(collectionAddress)
  const isPBCollection = isAddress(collectionAddress) === spaceinvadersBunniesAddress

  const sortByItems = [
    { label: t('Recently listed'), value: 'updatedAt' },
    { label: t('Lowest price'), value: 'currentAskPrice' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  return (
    <>
      {isPBCollection ? (
        <Container mb="24px">
          <Flex alignItems="center" justifyContent={['flex-start', null, null, 'flex-end']} mb="24px">
            <Box minWidth="165px">
              <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
                {t('Sort By')}
              </Text>
              <Select options={sortByItems} onOptionChange={handleChange} />
            </Box>
          </Flex>
          <SpaceinvadersBunniesCollectionNfts address={collection?.address} sortBy={sortBy} />
        </Container>
      ) : (
        <CollectionWrapper collection={collection} />
      )}
    </>
  )
}

export default Items
