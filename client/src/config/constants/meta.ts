import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Hydro Blockchain',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by Hydro Blockchain), NFTs, and more, on a platform you can trust.',
  image: 'https://Hydro Blockchain.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Hydro Blockchain')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('Hydro Blockchain')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('Hydro Blockchain')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('Hydro Blockchain')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('Hydro Blockchain')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('Hydro Blockchain')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Hydro Blockchain')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Hydro Blockchain')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('Hydro Blockchain')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Hydro Blockchain')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('Hydro Blockchain')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Hydro Blockchain')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Hydro Blockchain')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('Hydro Blockchain')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Hydro Blockchain')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Hydro Blockchain')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('Hydro Blockchain')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('Hydro Blockchain')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('Hydro Blockchain')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('Hydro Blockchain')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('Hydro Blockchain')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('Hydro Blockchain Info & Analytics')}`,
        description: 'View statistics for Hydro Blockchain exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('Hydro Blockchain Info & Analytics')}`,
        description: 'View statistics for Hydro Blockchain exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Pools')} | ${t('Hydro Blockchain Info & Analytics')}`,
        description: 'View statistics for Hydro Blockchain exchanges.',
      }
    default:
      return null
  }
}
