import React, { useEffect, useState } from 'react'
import { useWalletModal, Button } from "@pancakeswap-libs/uikit"
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { usePoolContract } from './hooks/usePoolContract'
import { sortAddress } from './utils';
import './App.css'
import PoolPairTable from './components/PoolPairTable/PoolPairTable';
import styled from 'styled-components'

function App() {
  const { account, connect, reset, status, ethereum, chainId } = useWallet();
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(
    (data) => connect(data),
    () => reset(),
    account
  );

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [canPreviousPage, setCanPrevousPage] = useState(false)
  const [canNextPage, setCanNextPage] = useState(false)
  const { pageCount, data, reward, isLoading } = usePoolContract(pageIndex, pageSize)

  useEffect(() => {
    if( status === 'connected' && account ) setPageIndex(0)
  }, [status, account])

  useEffect(() => {
    setCanNextPage(pageCount > pageIndex + 1 ? true: false)
    setCanPrevousPage( pageIndex > 0 ? true: false)
  }, [pageCount, pageIndex])

  return (
    <div className="App">
      <header className="App-header">
        {status === "connected" ? (
          <>
            <Button onClick={onPresentAccountModal}>
              {sortAddress(account)}
            </Button>
          </>
        ) : (
          <Button onClick={onPresentConnectModal}>Connect</Button>
        )}
      </header>
      {reward && 
      <Reward>
        <span>Reward Token : </span>
        <img src={reward.logoURI || ''} width="40px" height="40px" alt='' />
        <span>{reward.symbol}</span>
      </Reward>
      }
      {isLoading && account &&
      <Loading>
        Loading...
      </Loading>
      }
      {!account &&
      <Loading>
        Connect Wallet
      </Loading>
      }
      {!isLoading && account &&
        <PoolPairTable data={data} />
      }
  
      <Pagination>
        <button onClick={() => setPageIndex(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => setPageIndex(pageIndex - 1)} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => setPageIndex(pageIndex + 1)} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => setPageIndex(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount} 
          </strong>
          {' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </Pagination>
    </div>
  );
}

export default App;

const Pagination = styled.div`
  margin: 20px auto;
`

const Reward = styled.div`
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin: 20px;
  }
`
const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
  font-size: 20px;
`