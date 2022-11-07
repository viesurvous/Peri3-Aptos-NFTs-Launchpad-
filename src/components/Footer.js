import { React, useEffect, useState } from 'react';

import Navbar from "react-bootstrap/Navbar";


const Footer = (props) => {

  return (
    <Navbar bg={props.fixed < 768 ? "dark" : "transparent"} variant="light" className="py-3 px-3" fixed={props.fixed < 768 ? "none" : "bottom"}>
      <Navbar.Collapse className="justify-content-end">
        <a style={{textDecoration: "none"}} target="_blank" rel="noreferrer" className="text-light" href="https://twitter.com/dalookup"><small style={{fontSize: "12px"}}>Made with ❤ by {props.title}</small></a>
      </Navbar.Collapse>
    </Navbar>
    ); 
     
  };

  export default Footer; 