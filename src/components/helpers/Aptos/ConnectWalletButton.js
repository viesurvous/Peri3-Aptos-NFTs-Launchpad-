import React, { useState } from "react";

import {useWallet} from "@manahippo/aptos-wallet-adapter"
import ConnectWalletModal from "./ConnectWalletModal"
import { FaUser } from 'react-icons/fa';

const ConnectWalletButton = (props) => {
    const {connectButton, className, style, disabled, title, mint, mx} = props

    const wallet = useWallet()
    const [showModal, setShowModal] = useState(false)

    function handleButtonClick() {
        if (connectButton) {
            setShowModal(true)
            return
        }
        wallet.disconnect()
    }

    const button = <button disabled={disabled} className={`${className} ${'btn btn-outline-primary px-3 py-0 button-connect'} ${disabled ? "disabled" : ""} ${mx ? mx : ""}`} onClick={handleButtonClick} style={style}>
                        <div className="user-connect d-flex align-items-center">
                            {!mint && <FaUser/>}
                            <span className={mint ?"py-2 px-2 inner" : "border-start border-primary ms-3 ps-3 py-2"}>{connectButton ? title :  "Log out"}</span>
                            </div>
                    </button>

    return (
        <>
        {connectButton ? button : wallet.account?.address?.toString() !== undefined ? button : null}
        <ConnectWalletModal show={showModal} onConnect={() => setShowModal(false)} />
        </>
    )
}

export default ConnectWalletButton;