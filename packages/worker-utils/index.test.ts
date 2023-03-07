import { describe, it, expect } from 'vitest'
import { CORS_ALLOW, isOriginAllowed } from './index'

describe('worker-utils', () => {
  it.each([
    ['https://offsideswap.finance', true],
    ['https://offsideswap.com', true],
    ['https://aptosoffsideswap.finance', false],
    ['https://aptos.offsideswap.finance', true],
    ['https://offsideswap.finance.com', false],
    ['http://offsideswap.finance', false],
    ['https://offside.run', false],
    ['https://test.offside.run', true],
    ['http://localhost:3000', true],
    ['http://localhost:3001', true],
  ])(`isOriginAllowed(%s)`, (origin, expected) => {
    expect(isOriginAllowed(origin, CORS_ALLOW)).toBe(expected)
  })
})
