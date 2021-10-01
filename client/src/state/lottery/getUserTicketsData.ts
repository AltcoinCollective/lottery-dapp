import { TICKET_LIMIT_PER_REQUEST } from 'config/constants/lottery'
import { LotteryTicket } from 'config/constants/types'
import { UserTicketsResponse } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'


const lotteryContract = getLotteryV2Contract()

export const processRawTicketsResponse = (ticketsResponse: UserTicketsResponse): LotteryTicket[] => {
  const [ticketIds, ticketNumbers, ticketStatuses] = ticketsResponse
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
    const data = await lotteryContract.viewUserInfoForLotteryId(account, lotteryId, cursor, perRequestLimit)
    return processRawTicketsResponse(data)
  } catch (error) {
    console.error('viewUserInfoForLotteryId', error)
    return null
  }
}

export const fetchUserTicketsForOneRound = async (account: string, lotteryId: string): Promise<LotteryTicket[]> => {
  const cursor = 0
 // const numReturned = TICKET_LIMIT_PER_REQUEST
  const ticketData = []
  const response = await viewUserInfoForLotteryId(account, lotteryId, cursor, TICKET_LIMIT_PER_REQUEST)
  /* eslint-disable*/
  for await (const contents of response.map(file => file)) {
  //  if(numReturned === TICKET_LIMIT_PER_REQUEST)return;
  // cursor += TICKET_LIMIT_PER_REQUEST
   ticketData.push(contents)
    }

  // while (numReturned === TICKET_LIMIT_PER_REQUEST) {
  //   console.log('both tags', numReturned,TICKET_LIMIT_PER_REQUEST)
  //   // eslint-disable-next-line no-await-in-loop
  //   const response = await viewUserInfoForLotteryId(account, lotteryId, cursor, TICKET_LIMIT_PER_REQUEST)
  //   cursor += TICKET_LIMIT_PER_REQUEST
  //   numReturned = response?.length
  //   console.log('response', response)
  // }
  return ticketData
  
}

export const fetchUserTicketsForMultipleRounds = async (
  idsToCheck: string[],
  account: string,
): Promise<{ roundId: string; userTickets: LotteryTicket[] }[]> => {
  const ticketsForMultipleRounds = []
  //const ticketsForRound1 = await fetchUserTicketsForOneRound(account, '1')
 // console.log('single data', ticketsForRound1)

  // let i =0;
  // const roundId = idsToCheck[i]
  // const ticketsForRound2 = await fetchUserTicketsForOneRound(account, roundId)
  // for await (const contents of idsToCheck.map( file => file )) {
  //   console.log('round status',roundId, idsToCheck)
  //   ticketsForMultipleRounds.push({
  //     roundId,
  //     userTickets:ticketsForRound2
  //   })
  //   console.log('second loop', ticketsForMultipleRounds)
  //   i++;
  //   console.log('i >', i)
  //     }

  for (let i = 0; i < idsToCheck.length; i += 1) {
    const roundId = idsToCheck[i]
    // eslint-disable-next-line no-await-in-loop
    const ticketsForRound = await fetchUserTicketsForOneRound(account, roundId)
    ticketsForMultipleRounds.push({
      roundId,
      userTickets: ticketsForRound,
    })
    return ticketsForMultipleRounds;
  }

  return ticketsForMultipleRounds
}
