import { TICKET_LIMIT_PER_REQUEST } from 'config/constants/lottery'
import { LotteryTicket } from 'config/constants/types'
import { UserTicketsResponse } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'

const lotteryContract = getLotteryV2Contract()

export const processRawTicketsResponse = (ticketsResponse: UserTicketsResponse): LotteryTicket[] => {
  const [ticketIds, ticketNumbers, ticketStatuses] = ticketsResponse
  console.log('tickeet id', ticketIds, ticketNumbers)
  if (ticketIds?.length > 0) {
    return ticketIds.map((ticketId, index) => {
      return {
        id: ticketId.toString(),
        number: ticketNumbers[index].toString(),
        status: ticketStatuses[index],
      }
    })
  }
  return []
}

export const viewUserInfoForLotteryId = async (
  account: string,
  lotteryId: string,
  cursor: number,
  perRequestLimit: number,
): Promise<LotteryTicket[]> => {
  try {
    console.log('all info supplided', account, lotteryId, cursor, perRequestLimit)
    console.log(' lottery contract  ', await lotteryContract.viewUserInfoForLotteryId('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '1', 0, 0))
    const data = await lotteryContract.viewUserInfoForLotteryId(account, '1', 0, 0)
    console.log('data >>>>', data)
    return processRawTicketsResponse(data)
  } catch (error) {
    console.error('viewUserInfoForLotteryId', error)
    return null
  }
}

export const fetchUserTicketsForOneRound = async (account: string, lotteryId: string): Promise<LotteryTicket[]> => {
  let cursor = 0
  let numReturned = TICKET_LIMIT_PER_REQUEST
  const ticketData = []

  while (numReturned === TICKET_LIMIT_PER_REQUEST) {
    // eslint-disable-next-line no-await-in-loop
    const response = await viewUserInfoForLotteryId(account, lotteryId, cursor, TICKET_LIMIT_PER_REQUEST)
    cursor += TICKET_LIMIT_PER_REQUEST
    numReturned = response.length
    ticketData.push(...response)
  }

  return ticketData
}

export const fetchUserTicketsForMultipleRounds = async (
  idsToCheck: string[],
  account: string,
): Promise<{ roundId: string; userTickets: LotteryTicket[] }[]> => {
  const ticketsForMultipleRounds = []
  for (let i = 0; i < idsToCheck.length; i += 1) {
    const roundId = idsToCheck[i]
    // eslint-disable-next-line no-await-in-loop
    const ticketsForRound = await fetchUserTicketsForOneRound(account, roundId)
    ticketsForMultipleRounds.push({
      roundId,
      userTickets: ticketsForRound,
    })
  }
  return ticketsForMultipleRounds
}
