// TODO: aptos merge
import { LinkExternal, Text } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'
import truncateHash from '@spaceinvaders-swap/utils/truncateHash'
import { getBlockExploreLink } from '../../utils'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({ txHash, children }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <LinkExternal isAptosScan href={getBlockExploreLink(txHash, 'transaction', chainId)}>
          {t('View on %site%', { site: 'Explorer' })}: {truncateHash(txHash, 8, 0)}
        </LinkExternal>
      )}
    </>
  )
}

export default DescriptionWithTx
