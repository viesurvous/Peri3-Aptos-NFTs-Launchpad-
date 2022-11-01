import { React, useEffect, useState } from 'react';

import Navbar from "react-bootstrap/Navbar";


const Footter = (props) => {

  return (
    <Navbar bg="dark" variant="light" className="py-3 px-3" fixed="bottom">
      <Navbar.Collapse className="justify-content-end">
        <a style={{textDecoration: "none"}} className="text-light" href=""><small style={{fontSize: "11px"}}>Powered by {props.title}</small></a>
      </Navbar.Collapse>
    </Navbar>
    ); 
     
  };

  export default Footter; 