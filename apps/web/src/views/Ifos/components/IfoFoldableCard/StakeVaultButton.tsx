import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@offsideswap/uikit'
import { useConfig } from 'views/Ifos/contexts/IfoContext'

import { useTranslation } from '@offsideswap/localization'

const StakeVaultButton = (props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useConfig()
  const isFinishedPage = router.pathname.includes('history')

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  const handleClickButton = () => {
    // Always expand for mobile
    if (!isExpanded) {
      setIsExpanded(true)
    }

    if (isFinishedPage) {
      router.push('/ifo')
    } else {
      scrollToTop()
    }
  }

  return (
    <Button {...props} onClick={handleClickButton}>
      {t('Go to ROTO pool')}
    </Button>
  )
}

export default StakeVaultButton
