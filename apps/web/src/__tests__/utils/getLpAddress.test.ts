import { ERC20Token, ChainId } from '@spaceinvaders-swap/sdk'
import getLpAddress from 'utils/getLpAddress'

const INVA_AS_STRING = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
const BUSD_AS_STRING = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
const INVA_AS_TOKEN = new ERC20Token(ChainId.BSC, INVA_AS_STRING, 18)
const BUSD_AS_TOKEN = new ERC20Token(ChainId.BSC, BUSD_AS_STRING, 18)
const INVA_BUSD_LP = '0x804678fa97d91B974ec2af3c843270886528a9E6'

describe('getLpAddress', () => {
  it('returns correct LP address, both tokens are strings', () => {
    expect(getLpAddress(INVA_AS_STRING, BUSD_AS_STRING)).toBe(INVA_BUSD_LP)
  })
  it('returns correct LP address, token1 is string, token 2 is Token', () => {
    expect(getLpAddress(INVA_AS_STRING, BUSD_AS_TOKEN)).toBe(INVA_BUSD_LP)
  })
  it('returns correct LP address, both tokens are Token', () => {
    expect(getLpAddress(INVA_AS_TOKEN, BUSD_AS_TOKEN)).toBe(INVA_BUSD_LP)
  })
  it('returns null if any address is invalid', () => {
    expect(getLpAddress('123', '456')).toBe(null)
    expect(getLpAddress(undefined, undefined)).toBe(null)
    expect(getLpAddress(INVA_AS_STRING, undefined)).toBe(null)
    expect(getLpAddress(undefined, BUSD_AS_TOKEN)).toBe(null)
    expect(getLpAddress(INVA_AS_STRING, '456')).toBe(null)
    expect(getLpAddress('123', BUSD_AS_TOKEN)).toBe(null)
  })
})
