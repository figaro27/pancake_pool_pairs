import { useState, useEffect } from 'react'
import { useWallet } from "@binance-chain/bsc-use-wallet"
import Web3 from 'web3'
import { MasterChefContract } from '../config/constant'
import ABI_MasterChef from '../config/ABI/ABI_MasterChef.json'
import ABI_Pair from '../config/ABI/ABI_Pair.json'

export const usePoolContract = (page, pageSize) => {
  const { account, connect, reset, status, ethereum, chainId } = useWallet();
  const [state, setState] = useState({
    data: [],
    isLoading: false,
    pageCount: 0,
    reward: null
  })
  const [poolLength, setPoolLength] = useState(0)
  const [tokens, setTokens] = useState({})

  const getPancakeSwapTokens = async () => {
    fetch('https://tokens.pancakeswap.finance/pancakeswap-extended.json')
      .then(response => response.json())
      .then(data => {
        const _tokens = data.tokens.reduce((total, token) => {
          let _total = total
          _total[token.address] = token
          return _total
        }, {})
        setTokens(_tokens)
      });
  }

  const getTotalPages = async (pageSize) => {
    const web3 = new Web3(ethereum)
    const masterChefContract = new web3.eth.Contract(ABI_MasterChef, MasterChefContract)
    try {
      const _poolLen = await masterChefContract.methods.poolLength().call()
      setPoolLength(_poolLen)
      return Math.ceil(_poolLen / pageSize)
    } catch (e) {
        console.log(e)
    }
    return 0
  }

  const getReward = async () => {
    const web3 = new Web3(ethereum)
    const masterChefContract = new web3.eth.Contract(ABI_MasterChef, MasterChefContract)
    try {
      const _reward = await masterChefContract.methods.cake().call()
      return  tokens[_reward] ? tokens[_reward] : null
    } catch (e) {
        console.log(e)
    }
  }

  const getPoolInfo = async (page, pageSize, pageCount) => {
    const web3 = new Web3(ethereum)
    const masterChefContract = new web3.eth.Contract(ABI_MasterChef, MasterChefContract)
    try {
      const arr = new Array(pageSize).fill(0)
      const _data = arr.map(async (item, idx) => {
        if (pageSize * page + idx + 1 < pageSize * pageCount) {
          let pool = await masterChefContract.methods.poolInfo(pageSize * page + idx + 1).call()
          const pairContract = new web3.eth.Contract(ABI_Pair, pool.lpToken)
          const token0 = await pairContract.methods.token0().call()
          const token1 = await pairContract.methods.token1().call()
          pool.token0 = token0
          pool.token1 = token1
          pool.token0Logo = tokens[token0] ? tokens[token0].logoURI : ''
          pool.token0Symbol = tokens[token0] ? tokens[token0].symbol : ''
          pool.token1Logo = tokens[token1] ? tokens[token1].logoURI : ''
          pool.token1Symbol = tokens[token1] ? tokens[token1].symbol : ''
          console.log('pool---------', pool)
          return pool
        }
      })
      return Promise.all(_data)
    } catch (e) {
        console.log(e)
        return []
    }
  }

  useEffect(() => {
    getPancakeSwapTokens()
  }, [])

  useEffect(() => {
    if (status === 'connected' && account) {
      setState({ data: state.data, isLoading: true, pageCount: state.pageCount})
      getTotalPages(pageSize).then(_pageCount => {
        getReward().then( _reward => {         
          getPoolInfo(page, pageSize, _pageCount).then(_data => {
            setState({ data: _data, isLoading: false, pageCount: _pageCount, reward: _reward})
          })
        })
      })
    }
  }, [page, pageSize, status, account])

  return state  
}
