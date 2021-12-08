import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { light } from "@pancakeswap-libs/uikit"
import { ThemeProvider } from "styled-components"
import { ResetCSS, ModalProvider } from "@pancakeswap-libs/uikit"
import * as bsc from "@binance-chain/bsc-use-wallet"

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={light}>
      <ResetCSS />
      <bsc.UseWalletProvider
        chainId={56}
        connectors={{
          walletconnect: { rpcUrl: "https://bsc-dataseed.binance.org" },
          bsc,
        }}
      >
        <ModalProvider>
          <App />
        </ModalProvider>
      </bsc.UseWalletProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
