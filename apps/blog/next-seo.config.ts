import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | SpaceinvadersSwap',
  defaultTitle: 'Blog | SpaceinvadersSwap',
  description:
    'Cheaper and faster than Uniswap? Discover SpaceinvadersSwap, the leading DEX on BNB Smart Chain (BSC) with the best farms in DeFi and a lottery for INVA.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@SpaceinvadersSwap',
    site: '@SpaceinvadersSwap',
  },
  openGraph: {
    title: '🥞 SpaceinvadersSwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description:
      'The most popular AMM on BSC! Earn INVA through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by SpaceinvadersSwap), NFTs, and more, on a platform you can trust.',
    images: [{ url: 'https://spaceinvaders-swap.finance/images/hero.png' }],
  },
}
