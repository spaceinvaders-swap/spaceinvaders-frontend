import { Modal } from '@spaceinvaders-swap/uikit'
import { useTranslation } from '@spaceinvaders-swap/localization'

const ConfirmSwapModalContainer = ({ children, handleDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Confirm Swap')} headerBackground="gradientCardHeader" onDismiss={handleDismiss}>
      {children}
    </Modal>
  )
}

export default ConfirmSwapModalContainer
