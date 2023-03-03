import { useState, useEffect } from 'react'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { useInvaEnable } from 'hooks/useInvaEnable'
import { ENABLE_EXTEND_LOCK_AMOUNT } from '../../../helpers'

interface ExtendEnableProps {
  hasEnoughInva: boolean
  handleConfirmClick: () => void
  pendingConfirmTx: boolean
  isValidAmount: boolean
  isValidDuration: boolean
}

const ExtendEnable: React.FC<React.PropsWithChildren<ExtendEnableProps>> = ({
  hasEnoughInva,
  handleConfirmClick,
  pendingConfirmTx,
  isValidAmount,
  isValidDuration,
}) => {
  const { handleEnable, pendingEnableTx } = useInvaEnable(ENABLE_EXTEND_LOCK_AMOUNT)

  const [pendingEnableTxWithBalance, setPendingEnableTxWithBalance] = useState(pendingEnableTx)

  useEffect(() => {
    if (pendingEnableTx) {
      setPendingEnableTxWithBalance(true)
    } else if (hasEnoughInva) {
      setPendingEnableTxWithBalance(false)
    }
  }, [hasEnoughInva, pendingEnableTx])

  return (
    <ApproveConfirmButtons
      isApproveDisabled={!(isValidAmount && isValidDuration) || hasEnoughInva}
      isApproving={pendingEnableTxWithBalance}
      isConfirmDisabled={!(isValidAmount && isValidDuration) || !hasEnoughInva}
      isConfirming={pendingConfirmTx}
      onApprove={handleEnable}
      onConfirm={handleConfirmClick}
      useMinWidth={false}
    />
  )
}

export default ExtendEnable
