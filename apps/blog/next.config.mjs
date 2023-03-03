import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: [
      '@spaceinvaders-swap/uikit',
      '@spaceinvaders-swap/ui',
      '@spaceinvaders-swap/hooks',
      '@spaceinvaders-swap/localization',
      '@spaceinvaders-swap/utils',
    ],
  },
  compiler: {
    styledComponents: true,
  },
}

export default withAxiom(withVanillaExtract(nextConfig))
