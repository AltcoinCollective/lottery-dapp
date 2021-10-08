import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Hydro Project',
  description:'Hydro is a decentralized ecosystem using cutting-edge cryptography to secure user accounts, identities, and transactions.',
  image: '',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Hydro')}`,
      }

    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Hydro')}`,
      }

    default:
      return null
  }
}
