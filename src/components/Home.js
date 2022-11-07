import { React, useEffect, useState } from 'react';
import { Container, Col, Row } from "react-bootstrap";
import { collectionCoverUrl, collectionName } from "./helpers/candyMachineInfo"
import ConnectWalletButton from "./helpers/Aptos/ConnectWalletButton";
import { useWallet } from "@manahippo/aptos-wallet-adapter"


const Home = (props) => {

const wallet = useWallet();

return (
    <div className="main bg-dark text-white d-block d-md-flex align-items-center justify-content-center vh-100 flex-column py-5 py-md-0">
        <Container className="mb-5">
            <Row>
                <Col sm={12} md={6}>
                    <blockquote className="launchpad-informations my-4 ts">
                        <h1>Premium launchpad for <strong>Aptos</strong> creators.</h1>
                        <small>Low fee - Fully customizable</small>
                    </blockquote>
                    <a target="_blank" rel="noreferrer" className="text-white text-bold text-decoration-none ts" href="https://forms.gle/Lts3a4oWEJTCiaVEA">Apply to our {props.title} beta</a>
                </Col>
                <Col sm={12} md={6} className="my-4">
                    <blockquote className="d-block launchpad-informations my-4 text-center">
                        <img src={collectionCoverUrl} className={"d-block w-50 mx-auto my-auto" } style={{filter: "drop-shadow(10px 10px 15px rgba(0,0,0,0.3))"}}/>
                        <ConnectWalletButton title={'Mint ' + collectionName} mint={true} mx={"mx-auto mt-4"} connectButton={!wallet.connected} className="d-flex" />
                        <small style={{fontSize: "11px"}}>for free</small>
                    </blockquote>
                </Col>
            </Row>
        </Container>
    </div>
    ); 
     
  };

  export default Home; 