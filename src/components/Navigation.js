import { React, useEffect, useState } from 'react';

import { useWallet } from '@manahippo/aptos-wallet-adapter';
import ConnectWalletButton from "./helpers/Aptos/ConnectWalletButton";
import Navbar from "react-bootstrap/Navbar";
import { FaBars } from 'react-icons/fa';

const Navigation = (props) => {

  const [active, setActive] = useState('');
  const [toggleIcon, setToggleIcon] = useState('');
  
  const wallet = useWallet();

  return (
    <Navbar bg="dark" variant="dark" className="py-3 px-3 text-light navigation justify-content-between" fixed={props.fixed < 768 ? "none" : "top"}>
    <Navbar.Brand className="d-flex align-items-center">
      <img style={{width: "35px", marginRight: "10px"}} className="navbar-link_logo" src={props.logo}/>
      <div className="brand-name">
        <span className="me-1">{props.title}</span>
        <small style={{fontSize: "12px"}}>v0.1</small>
      </div>
    </Navbar.Brand>    
    <div className="d-none d-md-flex">
      <div className={'d-flex justify-content-end flex-row align-items-center'}>

      {wallet.connected && <small className="me-3">{wallet.account?.address?.toString().slice(0, 4) + '…' + wallet.account?.address?.toString().slice(62, 66)}</small>}
      <ConnectWalletButton title={"Connect wallet"} connectButton={!wallet.connected} className="d-flex" />
      </div>
    </div>
</Navbar>
  );    
};

  export default Navigation; 