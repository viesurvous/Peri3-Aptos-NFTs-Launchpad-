import React from 'react';
import { useWallet } from '@manahippo/aptos-wallet-adapter';


import Navigation from "./Navigation";
import Home from "./Home";
import MintingApplication from "./MintingApplication";
import Footer from "./Footer";

import Logo from "../assets/img/logo.png";
const launchpad = "TEST";

const Layout = (props) => {

  const wallet = useWallet();

  return (
    <>
      <Navigation title={launchpad} logo={Logo}/>
      {wallet.connected ? 
      <MintingApplication/>
        :
      <Home logo={Logo} title={launchpad}/>
      }
      <Footer title={launchpad}/>
    </>
  );

};

export default Layout;