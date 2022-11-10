import { React, useEffect, useState } from 'react';

import Navbar from "react-bootstrap/Navbar";
import { FaTwitter } from 'react-icons/fa';
import { FaDiscord } from 'react-icons/fa';


const Footer = (props) => {

  return (
    <Navbar bg={props.fixed < 768 ? "dark" : "transparent"} variant="light" className="py-3 px-3" fixed={"bottom"}>
      <Navbar.Collapse className="justify-content-end">
        <a style={{textDecoration: "none"}} target="_blank" rel="noreferrer" className="text-light" href="https://twitter.com/dalookup"><small style={{fontSize: "12px"}}>Made with ❤ by {props.title}</small></a>
      </Navbar.Collapse>
      <a target="_blank" rel="noreferrer" href={'https://twitter.com/peri3labs'}><FaTwitter size="18" className="mx-2" color="white"/></a>
        <a target="_blank" rel="noreferrer" href={'https://discord.gg/uAfVrydJBU'}><FaDiscord size="18" className="mx-sm-0 me-2 mx-md-2" color="white"/></a>
    </Navbar>
    ); 
     
  };

  export default Footer; 