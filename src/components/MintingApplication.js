import { React, useEffect, useState } from 'react';

import Waiter from "./Waiter";
import ProgressBar from "./ProgressBar"

import { Container, Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal"
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaTwitter } from 'react-icons/fa';
import { FaDiscord } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa';

import { AptosClient } from "aptos";
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import cmHelper from "./helpers/candyMachineHelper"
import {candyMachineAddress, collectionName, collectionDescription, collectionSocials, collectionCoverUrl, NODE_URL, CONTRACT_ADDRESS, COLLECTION_SIZE} from "./helpers/candyMachineInfo"

const aptosClient = new AptosClient(NODE_URL);
const autoCmRefresh = 10000;

const MintingApplication = (props) => {

  const wallet = useWallet();
  const [isFetchignCmData, setIsFetchignCmData] = useState(false)
  const [candyMachineData, setCandyMachineData] = useState({data: {}, fetch: fetchCandyMachineData})
  const [timeLeftToMint, setTimeLeftToMint] = useState({presale: "", public: "", timeout: null})

  const [mintInfo, setMintInfo] = useState({numToMint: 1, minting: false, success: false, mintedNfts: []})

  const [canMint, setCanMint] = useState(false)

  useEffect(() => {
    if (!wallet.autoConnect && wallet.wallet?.adapter) {
        wallet.connect();
    }
  }, [wallet.autoConnect, wallet.wallet, wallet.connect]);

  const mint = async () => {
    if (wallet.account?.address?.toString() === undefined || mintInfo.minting) return;

    console.log(wallet.account?.address?.toString());
    setMintInfo({...mintInfo, minting: true})
    // Generate a transaction
    const payload = {
      type: "entry_function_payload",
      function: `${CONTRACT_ADDRESS}::candy_machine_v2::mint_tokens`,
      type_arguments: [],
      arguments: [
      	candyMachineAddress,
	      collectionName,
	      mintInfo.numToMint,
      ]
    };

    let txInfo;
    try {
      const txHash = await wallet.signAndSubmitTransaction(payload);
      console.log(txHash);
      txInfo = await aptosClient.waitForTransactionWithResult(txHash.hash)
    } catch (err) {
      txInfo = {
        success: false,
        vm_status: err.message,
      }
    }
    handleMintTxResult(txInfo)
    if (txInfo.success) setCandyMachineData({...candyMachineData, data: {...candyMachineData.data, numMintedTokens: (parseInt(candyMachineData.data.numMintedTokens) + parseInt(mintInfo.numToMint)).toString()}})
  }

  async function handleMintTxResult(txInfo) {
    console.log(txInfo);
    const mintSuccess = txInfo.success;
    console.log(mintSuccess ? "Mint success!" : `Mint failure, an error occured.`)

    let mintedNfts = []
    if (!mintSuccess) {
        /// Handled error messages
        const handledErrorMessages = new Map([
            ["Failed to sign transaction", "An error occured while signing."],
            ["Move abort in 0x1::coin: EINSUFFICIENT_BALANCE(0x10006): Not enough coins to complete transaction", "Insufficient funds to mint."],
        ]);

        const txStatusError = txInfo.vm_status;
        console.error(`Mint not successful: ${txStatusError}`);
        let errorMessage = handledErrorMessages.get(txStatusError);
        errorMessage = errorMessage === undefined ? `Mint aborted : ${txStatusError}` : errorMessage;

        toast.error(errorMessage);
    } else {
        mintedNfts = await cmHelper.getMintedNfts(aptosClient, candyMachineData.data.tokenDataHandle, candyMachineData.data.cmResourceAccount, collectionName, txInfo)
        toast.success("Minting success!")
    }

    
    setMintInfo({...mintInfo, minting: false, success: mintSuccess, mintedNfts})
  }

  async function fetchCandyMachineData(indicateIsFetching = false) {
    if (indicateIsFetching) setIsFetchignCmData(true)
    const cmResourceAccount = await cmHelper.getCandyMachineResourceAccount();
    if (cmResourceAccount === null) {
      setCandyMachineData({...candyMachineData, data: {}})
      setIsFetchignCmData(false)
      return
    }

    const collectionInfo = await cmHelper.getCandyMachineCollectionInfo(cmResourceAccount);
    const configData = await cmHelper.getCandyMachineConfigData(collectionInfo.candyMachineConfigHandle);
    setCandyMachineData({...candyMachineData, data: {cmResourceAccount, ...collectionInfo, ...configData}})
    setIsFetchignCmData(false)
  }

  function verifyTimeLeftToMint() {
    const mintTimersTimeout = setTimeout(verifyTimeLeftToMint, 1000)
    if (candyMachineData.data.presaleMintTime === undefined || candyMachineData.data.publicMintTime === undefined) return

    const currentTime = Math.round(new Date().getTime() / 1000);
    setTimeLeftToMint({timeout : mintTimersTimeout, presale: cmHelper.getTimeDifference(currentTime, candyMachineData.data.presaleMintTime), public: cmHelper.getTimeDifference(currentTime, candyMachineData.data.publicMintTime)})
  }
 
  useEffect(() => { 
    fetchCandyMachineData(true)
    setInterval(fetchCandyMachineData, autoCmRefresh)
  }, [])

  useEffect(() => {
    clearTimeout(timeLeftToMint.timeout)
    verifyTimeLeftToMint() 
    console.log(candyMachineData.data);
    
  }, [candyMachineData])


  useEffect(() => {
    setCanMint(true);
  }, [wallet, candyMachineData, timeLeftToMint])

  const price = (candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2);
  const percentageMinted = 100 * candyMachineData.data.numMintedTokens / COLLECTION_SIZE;

  return (
    <div className="main bg-dark text-white d-flex align-items-center justify-content-center vh-100">
      {isFetchignCmData ?  
        <Waiter spinner={true} msg={"Fetching program data"} customColor={"rgba(255, 159, 156, 0.7)"}/>
      : 
        <>
          {!mintInfo.minting ? 
            <Container className="mw-992">
              <Row className="rounded-4 shadow border-row mx-auto overflow-hidden">
                {/** Collection Cover */}
                <Col md="6" className={"py-0 px-0 d-flex justify-content-center align-items-center overflow-hidden"}>
                  {collectionCoverUrl ? 
                    <img className="w-100 collection-cover_picture" src={collectionCoverUrl}/>
                    :
                    <Waiter spinner={true} customColor={"rgba(255, 159, 156, 0.7)"}/>
                  }
                </Col>
                {/** Collection Mint Application */}
                <Col md="6"className="p-3">
                    {/** TODO */}
                    <Row>
                      <Col sm="12" className="position-relative">
                        <div className="collection-info_header d-flex align-items-center justify-content-between mb-2">
                          <h4 className="fw-bolder m-0">{collectionName}</h4>
                          <div className="socials">
                            <a className="mx-2" target="_blank" rel="noreferrer" href={collectionSocials.discord}><FaDiscord size="24" color="white"/></a>
                            <a className="mx-2" target="_blank" rel="noreferrer" href={collectionSocials.twitter}><FaTwitter size="24" color="white"/></a>
                            <a className="mx-2" target="_blank" rel="noreferrer" href={collectionSocials.web}><FaGlobe size="24" color="white"/></a>

                            <Badge bg="primary">{candyMachineData.data.mintFee}</Badge>
                          </div>
                        </div>
                        <p className="text-justify" style={{fontSize : "16px"}}>{collectionDescription}</p>
                      </Col>
                    </Row>
                    <>
                      <Form.Label>Mint {mintInfo.numToMint}</Form.Label> 
                      <Form.Range 
                        min={2} 
                        max={10}
                        value={mintInfo.numToMint} 
                        onChange={(e) => setMintInfo({...mintInfo, numToMint: e.target.value})}
                      />
                    </>
                      <h5>Total : </h5>
                      <h5>Minted : {candyMachineData.data.numMintedTokens} / {COLLECTION_SIZE}</h5>
                    
                  {/** MINT STATE! */}
                  {timeLeftToMint.public === "LIVE" ? <span className={""}>LIVE</span> : <span className={""}> {timeLeftToMint.public.days + "d : " + timeLeftToMint.public.hours + "h : " + timeLeftToMint.public.minutes + "m : " + timeLeftToMint.public.seconds + "s"}</span>}

                  {/** PROGRESS BAR */}
                  <ProgressBar bgcolor={percentageMinted < 75 ? "#74f7de" : "rgb(255, 159, 156)"} completed={percentageMinted.toFixed(2)} itemsLeft={candyMachineData.data.numMintedTokens +"/"+ COLLECTION_SIZE}/>
                  
                  {/** MINT BUTTON */}
                  <button className={"btn btn-outline-primary d-block mx-auto mt-3 px-0 py-2 w-100"} onClick={mint} disabled={!canMint}>Mint</button>

                </Col>
              </Row>

              {/** TODO */}
              <Modal show={mintInfo.success} onHide={() => setMintInfo({...mintInfo, success: false, mintedNfts: []})} centered size="lg">
                <Modal.Body className="pt-5 pb-3">
                    <div className="my-5" style={{flexWrap: "wrap"}}>
                      {mintInfo.mintedNfts ? "true":"false"}
                        {mintInfo.mintedNfts.map(mintedNft => <div key={mintedNft.name} className={`d-flex flex-column mx-3`}>
                            <img className="w-25" src={mintedNft.imageUri === null ? "" : mintedNft.imageUri} />
                            <h5 className="text-white text-center mt-2">{mintedNft.name}</h5>¬
                        </div>)}
                    </div>
                </Modal.Body>
              </Modal>
            </Container>

          :
          <Waiter spinner={true} msg={"Minting " + mintInfo.numToMint + " " + collectionName } customColor={"#53fade"}/>
          }
        </>
      }
    </div>
  );
}; 

  export default MintingApplication;