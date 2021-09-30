import React from 'react'
import styled from 'styled-components'
// import { Spinner } from 'hydroprojectuikit'
import Page from '../Layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      Loading...
      {/* <Spinner /> */}
    </Wrapper>
  )
}

export default PageLoader
