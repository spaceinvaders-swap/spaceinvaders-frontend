import { useEffect } from 'react'
import { useInvaBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
  const invaPriceBusd = useInvaBusdPrice()
  useEffect(() => {
    const invaPriceBusdString = invaPriceBusd ? invaPriceBusd.toFixed(2) : ''
    document.title = `Spaceinvaders Swap - ${invaPriceBusdString}`
  }, [invaPriceBusd])
}
export default useGetDocumentTitlePrice
