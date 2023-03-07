import bundleAnalyzer from '@next/bundle-analyzer'
import { withAxiom } from 'next-axiom'

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    transpilePackages: [
      '@offsideswap/ui',
      '@offsideswap/uikit',
      '@offsideswap/localization',
      '@offsideswap/hooks',
      '@offsideswap/utils',
      '@offsideswap/tokens',
      '@offsideswap/farms',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: false,
      },
    ]
  },
}

export default withBundleAnalyzer(withVanillaExtract(withAxiom(nextConfig)))
