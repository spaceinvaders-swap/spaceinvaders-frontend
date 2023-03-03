import { describe, it, expect } from 'vitest'
import { CORS_ALLOW, isOriginAllowed } from './index'

describe('worker-utils', () => {
  it.each([
    ['https://spaceinvaders-swap.finance', true],
    ['https://spaceinvaders-swap.com', true],
    ['https://aptosspaceinvaders-swap.finance', false],
    ['https://aptos.spaceinvaders-swap.finance', true],
    ['https://spaceinvaders-swap.finance.com', false],
    ['http://spaceinvaders-swap.finance', false],
    ['https://spaceinvaders.run', false],
    ['https://test.spaceinvaders.run', true],
    ['http://localhost:3000', true],
    ['http://localhost:3001', true],
  ])(`isOriginAllowed(%s)`, (origin, expected) => {
    expect(isOriginAllowed(origin, CORS_ALLOW)).toBe(expected)
  })
})
