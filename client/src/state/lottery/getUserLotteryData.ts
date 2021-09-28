import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryTicket } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryResponse, UserRound } from 'state/types'
import { getRoundIdsArray, fetchMultipleLotteries, hasRoundBeenClaimed } from './helpers'
import { fetchUserTicketsForMultipleRounds } from './getUserTicketsData'
// import {  fetchUserTicketsForOneRound } from './getUserTicketsData'

export const MAX_USER_LOTTERIES_REQUEST_SIZE = 100

/* eslint-disable camelcase */
type UserLotteriesWhere = { lottery_in?: string[] }

const applyNodeDataToUserGraphResponse = (
  userNodeData: { roundId: string; userTickets: LotteryTicket[] }[],
  userGraphData: UserRound[],
  lotteryNodeData: LotteryResponse[],
): UserRound[] => {
  //   If no graph rounds response - return node data
  if (userGraphData.length === 0) {
    return lotteryNodeData.map((nodeRound) => {
      const ticketDataForRound = userNodeData.find((roundTickets) => roundTickets.roundId === nodeRound.lotteryId)
      return {
        endTime: nodeRound.endTime,
        status: nodeRound.status,
        lotteryId: nodeRound.lotteryId.toString(),
        claimed: hasRoundBeenClaimed(ticketDataForRound.userTickets),
        totalTickets: `${ticketDataForRound.userTickets.length.toString()}`,
        tickets: ticketDataForRound.userTickets,
      }
    })
  }

  // Return the rounds with combined node + subgraph data, plus all remaining subgraph rounds.
  const nodeRoundsWithGraphData = userNodeData.map((userNodeRound) => {
    const userGraphRound = userGraphData.find(
      (graphResponseRound) => graphResponseRound.lotteryId === userNodeRound.roundId,
    )
    const nodeRoundData = lotteryNodeData.find((nodeRound) => nodeRound.lotteryId === userNodeRound.roundId)
    return {
      endTime: nodeRoundData.endTime,
      status: nodeRoundData.status,
      lotteryId: nodeRoundData.lotteryId.toString(),
      claimed: hasRoundBeenClaimed(userNodeRound.userTickets),
      totalTickets: userGraphRound?.totalTickets || userNodeRound.userTickets.length.toString(),
      tickets: userNodeRound.userTickets,
    }
  })

  // Return the rounds with combined data, plus all remaining subgraph rounds.
  const [lastCombinedDataRound] = nodeRoundsWithGraphData.slice(-1)
  const lastCombinedDataRoundIndex = userGraphData
    .map((graphRound) => graphRound?.lotteryId)
    .indexOf(lastCombinedDataRound?.lotteryId)
  const remainingSubgraphRounds = userGraphData ? userGraphData.splice(lastCombinedDataRoundIndex + 1) : []
  const mergedResponse = [...nodeRoundsWithGraphData, ...remainingSubgraphRounds]
  return mergedResponse
}

export const getGraphLotteryUser = async (
  account: string,
  first = MAX_USER_LOTTERIES_REQUEST_SIZE,
  skip = 0,
  where: UserLotteriesWhere = {},
): Promise<LotteryUserGraphEntity> => {
  let user
  const blankUser = {
    account,
    totalCake: '',
    totalTickets: '',
    rounds: [],
  }

  try {
    const response = await request(
      GRAPH_API_LOTTERY,
      gql`
        query getUserLotteries($account: ID!, $first: Int!, $skip: Int!, $where: Round_filter) {
          user(id: $account) {
            id
            totalTickets
            totalCake
            rounds(first: $first, skip: $skip, where: $where, orderDirection: desc, orderBy: block) {
              id
              lottery {
                id
                endTime
                status
              }
              claimed
              totalTickets
            }
          }
        }
      `,
      { account: account.toLowerCase(), first, skip, where },
    )
    const userRes = response.user

    // If no user returned - return blank user
    if (!userRes) {
      user = blankUser
    } else {
      user = {
        account: userRes.id,
        totalCake: userRes.totalCake,
        totalTickets: userRes.totalTickets,
        rounds: userRes.rounds.map((round) => {
          return {
            lotteryId: round?.lottery?.id,
            endTime: round?.lottery?.endTime,
            claimed: round?.claimed,
            totalTickets: round?.totalTickets,
            status: round?.lottery?.status.toLowerCase(),
          }
        }),
      }
    }
  } catch (error) {
    console.error(error)
    user = blankUser
  }

  return user
}

// const idsForTicketsNodeCal = getRoundIdsArray('1')

// export const fetchUserTicketsForMultipleRound = async (
//   idsToCheck: string[],
//   account: string,
// ): Promise<{ roundId: string; userTickets: LotteryTicket[] }[]> => {
//   const ticketsForMultipleRounds = []
//   for (let i = 0; i < idsToCheck.length; i += 1) {
//     const roundId = idsToCheck[i]
//     // eslint-disable-next-line no-await-in-loop
//     const ticketsForRound = await fetchUserTicketsForOneRound(account, roundId)

    
//     ticketsForMultipleRounds.push({
//       roundId,
//       userTickets: ticketsForRound,
//     })

//     console.log('data to', ticketsForMultipleRounds)

//   }
//   // ticketsForMultipleRounds
//   return [{roundId: "1", userTickets:[ {id: '0', number: '1762547', status: false}]}]
// }

// const data = fetchUserTicketsForMultipleRound(idsForTicketsNodeCal, '0xbcaAB35233Ec7305D83C0A5b25d4d20C60B38Fb4')
// console.log('data',data, 'data')

const getUserLotteryData = async (account: string, currentLotteryId: string): Promise<LotteryUserGraphEntity> => {
  const idsForTicketsNodeCall = getRoundIdsArray(currentLotteryId)
  const roundDataAndUserTickets = await fetchUserTicketsForMultipleRounds(idsForTicketsNodeCall, account)
  const userRoundsNodeData = roundDataAndUserTickets.filter((round) => round.userTickets.length > 0)
  const idsForLotteriesNodeCall = userRoundsNodeData.map((round) => round.roundId)
  const lotteriesNodeData = await fetchMultipleLotteries(idsForLotteriesNodeCall)
  const graphResponse = await getGraphLotteryUser(account)
  const mergedRoundData = applyNodeDataToUserGraphResponse(userRoundsNodeData, graphResponse.rounds, lotteriesNodeData)
  const graphResponseWithNodeRounds = { ...graphResponse, rounds: mergedRoundData }
  return graphResponseWithNodeRounds
}

export default getUserLotteryData
