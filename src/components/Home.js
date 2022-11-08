import { React, useEffect, useState } from 'react';
import { Container, Col, Row } from "react-bootstrap";
import { collectionCoverUrl, collectionName, collectionSocials } from "./helpers/candyMachineInfo"
import ConnectWalletButton from "./helpers/Aptos/ConnectWalletButton";
import { useWallet } from "@manahippo/aptos-wallet-adapter"
import { FaTwitter } from 'react-icons/fa';
import { FaDiscord } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa';
import Waiter from "./Waiter";

const Home = (props) => {

const wallet = useWallet();

return (
    <div className="main bg-dark text-white d-block d-md-flex align-items-center justify-content-center vh-100 flex-column py-5 py-md-0">
        <Container className="mb-5 mt-5">
            <Row>
                <Col sm={12} md={6}>
                    <blockquote className="launchpad-informations my-sm-5 my-md-2 py-sm-5 py-md-5 ts">
                        <h1>Premium launchpad for <strong>Aptos</strong> creators.</h1>
                        <small>Low fee - Fully customizable</small>
                    </blockquote>
                    <a target="_blank" rel="noreferrer" className="text-white text-bold text-decoration-none ts" href="https://forms.gle/Lts3a4oWEJTCiaVEA">Apply to our {props.title} beta</a>
                </Col>
                <Col sm={12} md={6} className="my-4">
                    <blockquote className="d-block launchpad-informations my-4 text-center">
                        {collectionCoverUrl ? 
                        <img src={collectionCoverUrl} className={"d-block w-50 mx-auto my-auto" } style={{filter: "drop-shadow(10px 10px 15px rgba(0,0,0,0.3))"}}/>
                        :           
                        <Waiter spinner={true} msg={""} customColor={"#53fade"}/>
                    }
                        <ConnectWalletButton title={'Mint ' + collectionName} mint={true} mx={"mx-auto mt-4"} connectButton={!wallet.connected} className="d-flex" />
                        <div className="socials mt-2">
                          {collectionSocials.discord ?
                          <a target="_blank" rel="noreferrer" href={collectionSocials.discord}><FaDiscord size="18" className="mx-sm-0 me-2 mx-md-2" color="white"/></a>
                          : <FaDiscord size="18" className="mx-2" color="rgba(255,255,255,0.3"/>
                          }         
                          {collectionSocials.twitter ?
                          <a target="_blank" rel="noreferrer" href={collectionSocials.twitter}><FaTwitter size="18" className="mx-2" color="white"/></a>
                          : <FaTwitter size="18" className="mx-2" color="rgba(255,255,255,0.3"/>
                          }
                          {collectionSocials.web ?
                          <a target="_blank" rel="noreferrer" href={collectionSocials.web}><FaGlobe size="18" className="mx-2" color="white"/></a>
                          : <>
                          <FaGlobe size="18" className="mx-2" color="rgba(255,255,255,0.3"/>
                          </>
                          }
                        </div>
                    </blockquote>
                </Col>
            </Row>
        </Container>
    </div>
    ); 
     
  };

  export default Home; 