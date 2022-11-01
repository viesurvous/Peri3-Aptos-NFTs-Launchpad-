import React from 'react';

import Navigation from "./Navigation";
import MintingApplication from "./MintingApplication";
import Footer from "./Footer";
import Logo from "../assets/img/logo.png";

const launchpad = "Peri";

const Layout = (props) => {

  return (
    <>
      <Navigation title={launchpad} logo={Logo}/>
      <MintingApplication/>
      <Footer title={launchpad}/>
    </>
  );

};

export default Layout;