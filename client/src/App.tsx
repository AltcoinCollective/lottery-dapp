import React, { lazy } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'hydroprojectuikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
// import { usePollBlockNumber } from 'state/block/hooks'
// import { usePollCoreFarmData } from 'state/farms/hooks'
// import { DatePickerPortal } from 'components/DatePicker'
import UserMenu from 'components/Menu/UserMenu'
import useFetchHydroPrice from 'views/Lottery/hooks/useFetchHydroPrice'
import GlobalStyle from './style/Global'
// import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
// import EasterEgg from './components/EasterEgg'
import history from './routerHistory'
import Logo from './assets/hydro-logo-svg.svg'
// Views included in the main bundle
// import Pools from './views/Pools'
// import Home from './views/Home'
// import Swap from './views/Swap'


// Route-based code splitting
// const Home = lazy(() => import('./views/Home'))
const Lottery = lazy(() => import('./views/Lottery'))
const NotFound = lazy(() => import('./views/NotFound'))


// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  useEagerConnect()
  const price  = useFetchHydroPrice()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      {/* <Menu> */}
        <div className='' style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          padding:'1.2rem 0.8rem',
          maxWidth:'65rem',
          margin:'auto'
          
        }}>
          <div><img src={Logo}  className="logo-img" alt='hydro project'/>
          {price > 0 &&
                  
          <p className='hydro-price' style={{
            display: "inline-block",
            transform:"translateY(-0.5rem)",
            marginLeft:"0.3rem",
            padding: ".3em .7em",
            fontSize: "85%",
            fontWeight: 700,
            lineHeight: 1,
            textAlign: "center",
            whiteSpace: "nowrap",
            verticalAlign: "baseline",
            borderRadius: ".25rem",
            color:"#fff",
            backgroundColor: "#323333"

          }}>${price.toFixed(2)}</p>
        }
          </div>
          <div>  
            <UserMenu />
          </div>
            </div>
        
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>     
              <Lottery />
            </Route>
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      {/* </Menu> */}
      {/* <EasterEgg iterations={2} /> */}
      <ToastListener />
      {/* <DatePickerPortal /> */}
    </Router>
  )
}

export default React.memo(App)
