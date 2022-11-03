import { React, useEffect, useState } from 'react';
import { Container, Col, Row } from "react-bootstrap";
import {candyMachineAddress, collectionName, collectionCoverUrl, NODE_URL, CONTRACT_ADDRESS, COLLECTION_SIZE} from "./helpers/candyMachineInfo"
import Logo from "../assets/img/logo.png";
import ConnectWalletButton from "./helpers/Aptos/ConnectWalletButton";
import {useWallet} from "@manahippo/aptos-wallet-adapter"


const Content = (props) => {

const wallet = useWallet();

return (
    ""
    ); 
     
  };

  export default Content; 