import { useEffect, useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import {ethers} from 'ethers'
import { State } from '../types'
import { fetchCurrentLotteryId, fetchCurrentLottery, fetchUserTicketsAndLotteries, fetchPublicLotteries } from '.'
import { useProcessLotteryResponse } from './helpers'



// custom hooks
export const useCustomLotteryInfo  = (contractABI, contractAddress )=>{
  const url = 'https://data-seed-prebsc-1-s3.binance.org:8545/'
  const [data, setData] = useState({currentLotteryId:null, maxNumberTicketsPerBuyOrClaim :null})

const memoizedFunc = useCallback(()=>{
  const getData = async ()=>{
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    try {
        const contract = new ethers.Contract(contractAddress,contractABI, customHttpProvider);
        const currentLotteryId = await contract.currentLotteryId()
        const maxNumberTicketsPerBuyOrClaim = await contract.maxNumberTicketsPerBuyOrClaim()
        setData({currentLotteryId, maxNumberTicketsPerBuyOrClaim })

        return {currentLotteryId, maxNumberTicketsPerBuyOrClaim };


    } catch (err) {
     return   err
    }   

}
  getData()
}, [contractABI, contractAddress])
  useEffect(()=>{
    memoizedFunc() 
  },[memoizedFunc])
  return data
}





// Lottery
export const useGetCurrentLotteryId = () => {
  return useSelector((state: State) => state.lottery.currentLotteryId)
}

export const useGetUserLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.userLotteryData)
}

export const useGetUserLotteryGraphRoundById = (lotteryId: string) => {
  const userLotteriesData = useGetUserLotteriesGraphData()
  return userLotteriesData.rounds.find((userRound) => userRound.lotteryId === lotteryId)
}

export const useGetLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.lotteriesData)
}

export const useGetLotteryGraphDataById = (lotteryId: string) => {
  const lotteriesData = useGetLotteriesGraphData()
  return lotteriesData?.find((lottery) => lottery.id === lotteryId)
}

export const useFetchLottery = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const currentLotteryId = useGetCurrentLotteryId()

  useEffect(() => {
    // get current lottery ID & max ticket buy
    dispatch(fetchCurrentLotteryId())
  }, [dispatch])

  useEffect(() => {
    if (currentLotteryId) {
      // Get historical lottery data from nodes +  last 100 subgraph entries
      dispatch(fetchPublicLotteries({ currentLotteryId }))
      // get public data for current lottery
      dispatch(fetchCurrentLottery({ currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, fastRefresh])

  useEffect(() => {
    // get user tickets for current lottery, and user lottery subgraph data
    if (account && currentLotteryId) {
      dispatch(fetchUserTicketsAndLotteries({ account, currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, account])
}

export const useLottery = () => {
  const currentRound = useSelector((state: State) => state.lottery.currentRound)
  const processedCurrentRound = useProcessLotteryResponse(currentRound)

  const isTransitioning = useSelector((state: State) => state.lottery.isTransitioning)

  const currentLotteryId = useGetCurrentLotteryId()
  const userLotteryData = useGetUserLotteriesGraphData()
  const lotteriesData = useGetLotteriesGraphData()

  const maxNumberTicketsPerBuyOrClaimAsString = useSelector(
    (state: State) => state.lottery.maxNumberTicketsPerBuyOrClaim,
  )
  const maxNumberTicketsPerBuyOrClaim = useMemo(() => {
    return new BigNumber(maxNumberTicketsPerBuyOrClaimAsString)
  }, [maxNumberTicketsPerBuyOrClaimAsString])

  return {
    currentLotteryId,
    maxNumberTicketsPerBuyOrClaim,
    isTransitioning,
    userLotteryData,
    lotteriesData,
    currentRound: processedCurrentRound,
  }
}
