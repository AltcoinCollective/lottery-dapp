import { ChainId } from '@pancakeswap/sdk'
import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  if(address[97] ==='0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576'){
    console.log('multicall', address[chainId])
  }
  if(address[97] ==='0x1dEf72266e09e9EB7d7b49048DA55B58Aded4E40'){
    console.log('lottery', address[chainId])
  }
  // console.log('get address', address[chainId])
  // console.log('chain id',  chainId, process.env)
  return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
 
  return getAddress(addresses.multiCall)
}
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition)
}
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}
export const getPredictionsAddress = () => {
  return getAddress(addresses.predictions)
}
export const getChainlinkOracleAddress = () => {
  return getAddress(addresses.chainlinkOracle)
}
export const getBunnySpecialCakeVaultAddress = () => {
  return getAddress(addresses.bunnySpecialCakeVault)
}
export const getBunnySpecialPredictionAddress = () => {
  return getAddress(addresses.bunnySpecialPrediction)
}
export const getBunnySpecialLotteryAddress = () => {
  return getAddress(addresses.bunnySpecialLottery)
}
export const getFarmAuctionAddress = () => {
  return getAddress(addresses.farmAuction)
}
