import { Token } from '@spaceinvaders-swap/sdk'
import { Box, Card, Text } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'
import PreviousBetsTable from '../PreviousBetsTable'

interface DesktopBetsTableProps {
  account: string
  token: Token
  api: string
}

const DesktopBetsTable: React.FC<React.PropsWithChildren<DesktopBetsTableProps>> = ({ account, token, api }) => {
  const { t } = useTranslation()

  return (
    <Box p="24px">
      <Text as="h5" color="secondary" fontWeight="bold" textTransform="uppercase" fontSize="12px" mb="16px">
        {t('Last %num% Bets', { num: 5 })}
      </Text>
      <Card>{account && <PreviousBetsTable token={token} api={api} account={account} />}</Card>
    </Box>
  )
}

export default DesktopBetsTable
