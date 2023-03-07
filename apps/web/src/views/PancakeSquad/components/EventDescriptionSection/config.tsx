import { Text } from '@offsideswap/uikit'
import { ContextApi } from '@offsideswap/localization'
import Link from 'next/link'

type EventDescriptionType = {
  t: ContextApi['t']
}

const eventDescriptionConfigBuilder = ({ t }: EventDescriptionType) => ({
  headingText: t('Fair, Random, Rare'),
  subHeadingText: t(
    'All Offside Squad NFTs are allocated to Squad Ticket holders through a provably-fair system based on ChainLink at the time of minting.',
  ),
  bodyTextHeader: t('Out of the 10,000 total NFTs in the squad,'),
  bodyText: [
    {
      id: 1,
      content: (
        <>{t('490 are available in the pre-sale for owners of Gen 0 Offside Bunnies (bunnyID 0, 1, 2, 3, 4)')}</>
      ),
    },
    { id: 2, content: t('120 are reserved by the team for community giveaways, etc;') },
    {
      id: 3,
      content: (
        <>
          {t('and the remaining NFTs can be minted by anyone with a ')}
          <Link href="/profile" passHref>
            <Text as="a" display="inline-block" color="primary" bold>
              {t('Offside Profile!')}
            </Text>
          </Link>
        </>
      ),
    },
  ],
  primaryButton: {
    to: 'https://docs.offsideswap.finance/',
    text: t('View Documentation'),
    external: true,
    isDisplayed: false,
  },
  image: { src: '/images/offsideSquad/moonBunny/body.png', alt: 'moon bunny' },
  accessoriesImages: [
    { src: '/images/offsideSquad/moonBunny/band.png', alt: 'headband' },
    { src: '/images/offsideSquad/moonBunny/cloth.png', alt: 'cloth' },
    { src: '/images/offsideSquad/moonBunny/glasses.png', alt: 'glasses' },
    { src: '/images/offsideSquad/moonBunny/offside.png', alt: 'offside' },
  ],
})

export default eventDescriptionConfigBuilder
