import {ethers} from 'ethers'

type ResponseData = {
    currentLotteryId?: Promise<any>;
  };
  
  export const lotterInfo =async (contractABI, contractAddress)=>{
    const url = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    
    try {
        const contract = new ethers.Contract(contractAddress,contractABI, customHttpProvider);
  
        
        const currentLotteryId = <ResponseData> await contract.currentLotteryId()
   
        return  currentLotteryId
  
  
    } catch (err) {
     return   err
    }   
  
  }
  
  export const lotterInfoMaxBuy =async (contractABI, contractAddress)=>{
    const url = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    
    try {
        const contract = new ethers.Contract(contractAddress,contractABI, customHttpProvider);
        
        const maxNumberTicketsPerBuyOrClaim = await contract.maxNumberTicketsPerBuyOrClaim()
      
        return maxNumberTicketsPerBuyOrClaim
  
  
    } catch (err) {
     return  err
    }   
  
  }



  