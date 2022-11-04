import React from 'react';
import { useWallet } from '@manahippo/aptos-wallet-adapter';


import Navigation from "./Navigation";
import Home from "./Home";
import Content from "./Content";

import MintingApplication from "./MintingApplication";
import Footer from "./Footer";

import Logo from "../assets/img/logo.png";
const launchpad = "Layout3";

const Layout = (props) => {

  const wallet = useWallet();

  return (
    <>
      <Navigation title={launchpad} logo={Logo} fixed={wallet.connected ? "top" : ""}/>
      {wallet.connected ? 
      <MintingApplication/>
        :
       <> 
        <Home logo={Logo} title={launchpad}/>
        <Content title={launchpad}/>
      </>
      }
      <Footer title={launchpad}/>
    </>
  );

};

export default Layout;