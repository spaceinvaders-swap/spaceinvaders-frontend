import { TranslateFunction } from '@spaceinvaders-swap/localization'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade anything. No registration, no hassle.'),
  bodyText: t('Trade any token on BNB Smart Chain in seconds, just by connecting your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.spaceinvaders-swap.finance/',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BNB', alt: t('BNB token') },
      { src: 'BTC', alt: t('BTC token') },
      { src: 'INVA', alt: t('INVA token') },
    ],
  },
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('SpaceinvadersSwap makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.spaceinvaders-swap.finance/products/yield-farming',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: t('Pie chart') },
      { src: 'stonks', alt: t('Stocks chart') },
      { src: 'folder', alt: t('Folder with inva token') },
    ],
  },
})

export const invaSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('INVA makes our world go round.'),
  bodyText: t(
    'INVA token is at the heart of the SpaceinvadersSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56',
    text: t('Buy INVA'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.spaceinvaders-swap.finance/tokenomics/inva',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/inva/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d spaceinvaders') },
      { src: 'top-right', alt: t('Small 3d spaceinvaders') },
      { src: 'coin', alt: t('INVA token') },
      { src: 'top-left', alt: t('Small 3d spaceinvaders') },
    ],
  },
})
