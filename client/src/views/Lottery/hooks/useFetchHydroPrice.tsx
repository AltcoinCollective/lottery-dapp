import {useEffect, useState} from 'react'

function useFetchHydroPrice() {
    const [price, setPrice] = useState(null)
    const fetchData =async()=>{
        fetch('https://api.coingecko.com/api/v3/simple/price/?ids=hydro&vs_currencies=usd').then(c => c.json()).then(d =>setPrice(d?.hydro?.usd))
      }

      useEffect(() => {
        fetchData() 
      }, [])

    return Number(price)
}

export default useFetchHydroPrice
