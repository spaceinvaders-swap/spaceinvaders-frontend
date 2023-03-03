import React from 'react'
import { useIsMounted } from '@spaceinvaders-swap/hooks'

interface NoSSRProps {
  children?: React.ReactNode
  loader?: React.ReactNode
}

const NoSSR: React.FC<NoSSRProps> = ({ children, loader }) => {
  const isMounted = useIsMounted()

  return <>{isMounted ? children : loader ?? null}</>
}

export default NoSSR
