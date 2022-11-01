
import {useWallet} from "@manahippo/aptos-wallet-adapter"

import Modal from "react-bootstrap/Modal"

import "../../../scss/Modal.scss";
const ConnectWalletModal = (props) => {
    const {show, onConnect} = props

    const wallet = useWallet()

    return (
        <Modal show={show} onHide={onConnect} centered>
            <Modal.Body className="d-flex flex-column py-3 px-0 text-white rounded-4">
                <div className="pb-3 text-center border-bottom border-dark"><span className="fw-bold">Connect a wallet to continue</span></div>
                {wallet.wallets.map((walletType) => {
                    const adapter = walletType.adapter;
                    return <button key={adapter.name} className={'d-flex align-items-center option px-4 py-3 text-white'} onClick={async () => {
                        await wallet.select(adapter.name);
                        onConnect();
                      }}>
                        <img src={adapter.icon} />
                        <h6 className="mb-0 shadow">{adapter.name}</h6>
                    </button>
                })}
            </Modal.Body>
        </Modal>
    )
}

export default ConnectWalletModal;