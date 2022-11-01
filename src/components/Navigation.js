import { React, useEffect, useState } from 'react';

import { useWallet } from '@manahippo/aptos-wallet-adapter';
import ConnectWalletButton from "./helpers/Aptos/ConnectWalletButton";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Navbar";


const Navigation = (props) => {
  const wallet = useWallet()

  return (
    <Navbar bg="dark" variant="dark" className="py-3 px-3" fixed="top">
      <Navbar.Brand>
        <a className="navbar-link" href="/">
          <img style={{width: "50px", marginRight: "10px"}} className="navbar-link_logo" src={props.logo}/>
        </a>
        <span>{props.title}</span>
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <ConnectWalletButton connectButton={!wallet.connected} className="d-flex" />
      </Navbar.Collapse>
    </Navbar>
    ); 
     
  };

  export default Navigation; 