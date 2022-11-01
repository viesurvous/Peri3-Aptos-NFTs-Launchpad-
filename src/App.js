import React from 'react';

import Layout  from './components/Layout';
import { ToastContainer } from 'react-toastify';

import {
  WalletProvider,
  HippoWalletAdapter,
  AptosWalletAdapter,
  HippoExtensionWalletAdapter,
  MartianWalletAdapter,
  FewchaWalletAdapter,
  PontemWalletAdapter,
  SpikaWalletAdapter,
  RiseWalletAdapter,
  FletchWalletAdapter
} from '@manahippo/aptos-wallet-adapter';


const App = () => {
  const wallets = [
    new RiseWalletAdapter(),
    new MartianWalletAdapter(),
    new AptosWalletAdapter(),
    new FewchaWalletAdapter(),
    new PontemWalletAdapter(),
    new SpikaWalletAdapter(),
    new FletchWalletAdapter()
  ];

  console.log(wallets);
  return (
    <WalletProvider
      wallets={wallets}
      autoConnect={false}
      onError={(error) => {
        console.log('Handle Error Message', error);
      }}>
        <Layout theme="dark"/>
      <ToastContainer/>
    </WalletProvider>
  );
};

export default App;