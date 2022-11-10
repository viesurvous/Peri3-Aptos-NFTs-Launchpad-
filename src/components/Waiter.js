

import BounceLoader from "react-spinners/BounceLoader";

const Waiter = (props) => {
  
    return (
        <div className={`${props.nfts ? "d-flex align-items-center justify-content-center" : " infos"} bg-dark`}>
          {props.spinner &&
            <div className={`${props.nfts ? "me-4" : "d-flex"} justify-content-center`}>
              <BounceLoader size={props.size ? props.size : "40px"} color={props.customColor ? props.customColor : "rgb(206, 225, 253)" }/>
            </div>
          }
          {props.msg &&
            <>
              {props.nfts ? <small> {props.msg} </small> : 
              <p className="d-block h4 text-center info-inner mt-3">
              {props.msg}
              </p>
              }
            </>
          }
        </div>
    )
}

export default Waiter;