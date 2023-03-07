import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: [
      '@offsideswap/uikit',
      '@offsideswap/ui',
      '@offsideswap/hooks',
      '@offsideswap/localization',
      '@offsideswap/utils',
    ],
  },
  compiler: {
    styledComponents: true,
  },
}

export default withAxiom(withVanillaExtract(nextConfig))
