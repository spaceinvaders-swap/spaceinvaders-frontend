import { TranslateFunction } from '@offsideswap/localization'
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
    to: 'https://docs.offsideswap.finance/',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BNB', alt: t('BNB token') },
      { src: 'BTC', alt: t('BTC token') },
      { src: 'ROTO', alt: t('ROTO token') },
    ],
  },
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('OffsideSwap makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.offsideswap.finance/products/yield-farming',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: t('Pie chart') },
      { src: 'stonks', alt: t('Stocks chart') },
      { src: 'folder', alt: t('Folder with roto token') },
    ],
  },
})

export const rotoSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('ROTO makes our world go round.'),
  bodyText: t(
    'ROTO token is at the heart of the OffsideSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56',
    text: t('Buy ROTO'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.offsideswap.finance/tokenomics/roto',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/roto/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d offside') },
      { src: 'top-right', alt: t('Small 3d offside') },
      { src: 'coin', alt: t('ROTO token') },
      { src: 'top-left', alt: t('Small 3d offside') },
    ],
  },
})
