import { useEffect } from 'react'
import { useRotoBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
  const rotoPriceBusd = useRotoBusdPrice()
  useEffect(() => {
    const rotoPriceBusdString = rotoPriceBusd ? rotoPriceBusd.toFixed(2) : ''
    document.title = `Offside Swap - ${rotoPriceBusdString}`
  }, [rotoPriceBusd])
}
export default useGetDocumentTitlePrice
