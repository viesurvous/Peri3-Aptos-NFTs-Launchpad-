import { React, useEffect, useState } from 'react';

import { useWallet } from '@manahippo/aptos-wallet-adapter';
import ConnectWalletButton from "./helpers/Aptos/ConnectWalletButton";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Navbar";

const Navigation = (props) => {

  const wallet = useWallet();

  return (
    <Navbar bg="dark" variant="dark" className="py-3 px-3 text-light" fixed={props.fixed}>
      <Navbar.Brand className="d-flex align-items-center">
        <img style={{width: "35px", marginRight: "10px"}} className="navbar-link_logo" src={props.logo}/>
        <div className="brand-name">
          <span className="me-1">{props.title}</span>
          <small style={{fontSize: "12px"}}>v0.1</small>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        {wallet.connected && <small className="me-3">{wallet.account?.address?.toString().slice(0, 4) + '…' + wallet.account?.address?.toString().slice(62, 66)}</small>}
        <ConnectWalletButton title={"Connect wallet"} connectButton={!wallet.connected} className="d-flex" />
      </Navbar.Collapse>
    </Navbar>
    ); 
     
  };

  export default Navigation; 