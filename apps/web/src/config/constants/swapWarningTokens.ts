import { Token } from '@offsideswap/sdk'
import { bscTokens } from '@offsideswap/tokens'
import { bscWarningTokens } from 'config/constants/warningTokens'

const { bondly, itam, ccar, bttold, abnbc } = bscTokens
const { pokemoney, free, safemoon, gala } = bscWarningTokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  bondly,
  itam,
  ccar,
  bttold,
  pokemoney,
  free,
  gala,
  abnbc,
}

export default SwapWarningTokens
