import { React, useEffect, useState } from 'react';
import { Container, Col, Row } from "react-bootstrap";
import {candyMachineAddress, collectionName, collectionCoverUrl, NODE_URL, CONTRACT_ADDRESS, COLLECTION_SIZE} from "./helpers/candyMachineInfo"
import Logo from "../assets/img/logo.png";


const Home = (props) => {

  return (
    <div className="main bg-dark text-white d-block d-md-flex align-items-center justify-content-center vh-100 flex-column py-5 py-md-0">
        <Container>
            <Row>
                <Col sm={12} md={6}>
                    <blockquote className="launchpad-informations my-4 ts">
                        <h1>Premium launchpad for <strong>Aptos</strong> creators.</h1>
                        <small>Premium - Low fee - Fully customizable</small>
                    </blockquote>
                    <button className="btn btn-outline-primary px-5 py-2 text-light">
                        <a target="_blank" rel="noreferrer" className="text-white text-decoration-none ts" href="https://forms.gle/Lts3a4oWEJTCiaVEA">Launch with {props.title}</a>
                    </button>
                </Col>
                <Col sm={12} md={6} className="d-none d-md-block">
                    <blockquote className="d-block launchpad-informations my-4">
                        <img src={Logo} className={"d-block w-50 mx-auto my-auto" } style={{filter: "drop-shadow(10px 10px 15px rgba(0,0,0,0.3))"}}/>
                    </blockquote>
                </Col>
            </Row>
        </Container>
    </div>
    ); 
     
  };

  export default Home; 