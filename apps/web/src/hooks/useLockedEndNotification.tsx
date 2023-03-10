import { useToast, Text, Link } from '@spaceinvaders-swap/uikit'
import { useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { useTranslation } from '@spaceinvaders-swap/localization'
import isUndefinedOrNull from '@spaceinvaders-swap/utils/isUndefinedOrNull'
import { useAtom } from 'jotai'
import { createJSONStorage } from 'jotai/utils'
import { useAccount } from 'wagmi'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { useUserInvaLockStatus } from './useUserInvaLockStatus'

const storage = createJSONStorage(() => sessionStorage)
storage.delayInit = true
const lockedNotificationShowAtom = atomWithStorageWithErrorCatch('lockedNotificationShow', true, storage)
function useLockedNotificationShow() {
  return useAtom(lockedNotificationShowAtom)
}

const LockedEndDescription: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Text>
      <>
        {t('The locked staking duration has ended.')}
        <Link href="/pools">{t('Go to Pools')}</Link>
      </>
    </Text>
  )
}

const useLockedEndNotification = () => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()
  const { mutate } = useSWRConfig()
  const { address: account } = useAccount()
  const isUserLockedEnd = useUserInvaLockStatus()
  const [lockedNotificationShow, setLockedNotificationShow] = useLockedNotificationShow()

  useEffect(() => {
    if (account) {
      if (!isUndefinedOrNull(isUserLockedEnd)) {
        setLockedNotificationShow(true)
        mutate(['userInvaLockStatus', account])
      }
    } else {
      setLockedNotificationShow(true)
    }
  }, [setLockedNotificationShow, account, mutate, isUserLockedEnd])

  useEffect(() => {
    if (toastInfo && isUserLockedEnd && lockedNotificationShow) {
      toastInfo(t('Inva Syrup Pool'), <LockedEndDescription />)
      setLockedNotificationShow(false) // show once
    }
  }, [isUserLockedEnd, toastInfo, lockedNotificationShow, setLockedNotificationShow, t])
}

export default useLockedEndNotification
