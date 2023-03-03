import { useState } from 'react'
import { Token } from '@spaceinvaders-swap/aptos-swap-sdk'
import { ButtonMenu, ButtonMenuItem, ModalBody } from '@spaceinvaders-swap/uikit'
import styled from 'styled-components'
import { TokenList } from '@spaceinvaders-swap/token-lists'
import { useTranslation } from '@spaceinvaders-swap/localization'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import { CurrencyModalView } from './types'

const StyledButtonMenu = styled(ButtonMenu)`
  width: 100%;
`

export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [showLists, setShowLists] = useState(true)

  const { t } = useTranslation()

  return (
    <ModalBody style={{ overflow: 'visible' }}>
      <StyledButtonMenu
        activeIndex={showLists ? 0 : 1}
        onItemClick={() => setShowLists((prev) => !prev)}
        scale="sm"
        variant="subtle"
        mb="32px"
      >
        {[
          <ButtonMenuItem key="0" width="50%">
            {t('Lists')}
          </ButtonMenuItem>,
          <ButtonMenuItem key="1" width="50%">
            {t('Tokens')}
          </ButtonMenuItem>,
        ]}
      </StyledButtonMenu>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </ModalBody>
  )
}
