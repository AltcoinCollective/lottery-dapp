import { useCallback } from 'react'
import ethers, { Contract, CallOverrides } from 'ethers'
import { useGasPrice } from 'state/user/hooks'
import { get } from 'lodash'

/**
 * Perform a contract call with a gas price returned from useGasPrice
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export function useCallWithGasPrice() {
 // const gasPrice = useGasPrice()
  const gasPrice = '90000000000'
  console.log('gas price in hook', gasPrice)

  const callWithGasPrice = useCallback(
    async (
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      overrides: CallOverrides = null,
    ): Promise<ethers.providers.TransactionResponse> => {
      console.log('contract method', contract, methodName, 'ends', get)
      const contractMethod = get(contract, methodName)
      console.log('contract method result', contractMethod)
      console.log('over rides', overrides)
      const hasManualGasPriceOverride = overrides?.gasPrice
      console.log('has manual', hasManualGasPriceOverride)
         
      console.log('tx details',  [1,2], ...methodArgs,
 { ...overrides, gasPrice })
      const tx = await contractMethod(
        ...methodArgs,
        hasManualGasPriceOverride ? { ...overrides } : { ...overrides, gasPrice },
      )

      console.log('returned tx', tx)

      return tx
    },
    [gasPrice],
  )

  return { callWithGasPrice }
}
