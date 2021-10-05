import sample from 'lodash/sample'

// Array of available nodes to connect to
export const nodes = ['https://data-seed-prebsc-1-s3.binance.org:8545/']
// export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

const getNodeUrl = () => {
  return sample(nodes)
}

export default getNodeUrl
