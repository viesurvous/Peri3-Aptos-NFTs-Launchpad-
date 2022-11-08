

import BounceLoader from "react-spinners/BounceLoader";

const Waiter = (props) => {
  
    return (
        <div className="info bg-dark">
          {props.spinner &&
            <div className="d-flex justify-content-center">
              <BounceLoader color={props.customColor ? props.customColor : "rgb(206, 225, 253)" }/>
            </div>
          }
          {props.msg &&
            <h4 className="d-block h4 text-center info-inner mt-3">
              {props.msg}
            </h4>
          }
        </div>
    )
}

export default Waiter;