import { useState, useEffect } from 'react'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { useRotoEnable } from 'hooks/useRotoEnable'
import { ENABLE_EXTEND_LOCK_AMOUNT } from '../../../helpers'

interface ExtendEnableProps {
  hasEnoughRoto: boolean
  handleConfirmClick: () => void
  pendingConfirmTx: boolean
  isValidAmount: boolean
  isValidDuration: boolean
}

const ExtendEnable: React.FC<React.PropsWithChildren<ExtendEnableProps>> = ({
  hasEnoughRoto,
  handleConfirmClick,
  pendingConfirmTx,
  isValidAmount,
  isValidDuration,
}) => {
  const { handleEnable, pendingEnableTx } = useRotoEnable(ENABLE_EXTEND_LOCK_AMOUNT)

  const [pendingEnableTxWithBalance, setPendingEnableTxWithBalance] = useState(pendingEnableTx)

  useEffect(() => {
    if (pendingEnableTx) {
      setPendingEnableTxWithBalance(true)
    } else if (hasEnoughRoto) {
      setPendingEnableTxWithBalance(false)
    }
  }, [hasEnoughRoto, pendingEnableTx])

  return (
    <ApproveConfirmButtons
      isApproveDisabled={!(isValidAmount && isValidDuration) || hasEnoughRoto}
      isApproving={pendingEnableTxWithBalance}
      isConfirmDisabled={!(isValidAmount && isValidDuration) || !hasEnoughRoto}
      isConfirming={pendingConfirmTx}
      onApprove={handleEnable}
      onConfirm={handleConfirmClick}
      useMinWidth={false}
    />
  )
}

export default ExtendEnable
