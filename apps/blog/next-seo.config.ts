import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | OffsideSwap',
  defaultTitle: 'Blog | OffsideSwap',
  description:
    'Cheaper and faster than Uniswap? Discover OffsideSwap, the leading DEX on BNB Smart Chain (BSC) with the best farms in DeFi and a lottery for ROTO.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@OffsideSwap',
    site: '@OffsideSwap',
  },
  openGraph: {
    title: '🥞 OffsideSwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description:
      'The most popular AMM on BSC! Earn ROTO through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by OffsideSwap), NFTs, and more, on a platform you can trust.',
    images: [{ url: 'https://offsideswap.finance/images/hero.png' }],
  },
}
