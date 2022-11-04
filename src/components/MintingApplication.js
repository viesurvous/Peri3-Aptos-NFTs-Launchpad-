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
import {candyMachineAddress, collectionName, collectionDescription, collectionSocials, collectionBigCoverUrl, MaxMint, collectionCoverUrl, NODE_URL, CONTRACT_ADDRESS, COLLECTION_SIZE} from "./helpers/candyMachineInfo"

const aptosClient = new AptosClient(NODE_URL);
const autoCmRefresh = 100000;

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
  const incrementMintAmount = async () => {
    const mintfee = document.getElementById("mintfee")
    const mintAmount = document.getElementById("mintAmount")
    
    if (mintInfo.numToMint === 1) {
      setDecActive(current => !current);
      mintInfo.numToMint++; 
      mintfee.textContent = `${(candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2)} $APT`
      mintAmount.textContent = mintInfo.numToMint
    } 
    
    else if (mintInfo.numToMint === MaxMint-1) {
      setIncActive(current => !current);
      mintInfo.numToMint++; 
      mintfee.textContent = `${(candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2)} $APT`
      mintAmount.textContent = mintInfo.numToMint
    } 
    
    else if (mintInfo.numToMint < MaxMint) {
      mintInfo.numToMint++; 
      mintfee.textContent = `${(candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2)} $APT`
      mintAmount.textContent = mintInfo.numToMint
    }
  }

  const decrementMintAmount = async () => {
    
    const mintfee = document.getElementById("mintfee")
    const mintAmount = document.getElementById("mintAmount")
    
    if (mintInfo.numToMint === 2) {
      setDecActive(current => !current);
      mintInfo.numToMint--; 
      mintfee.textContent = `${(candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2)} $APT`
      mintAmount.textContent = mintInfo.numToMint
    } 
    
    else if (mintInfo.numToMint === MaxMint) {
      setIncActive(current => !current);
      mintInfo.numToMint--; 
      mintfee.textContent = `${(candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2)} $APT`
      mintAmount.textContent = mintInfo.numToMint
    } 
    
    else if (mintInfo.numToMint > 1) {
      mintInfo.numToMint--; 
      mintfee.textContent = `${(candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2)} $APT`
      mintAmount.textContent = mintInfo.numToMint

    }
  }

  const mint = async () => {
    if (wallet.account?.address?.toString() === undefined || mintInfo.minting) return;

    console.log(wallet);
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
      txInfo = await aptosClient.waitForTransactionWithResult(txHash.hash);
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

  const cartTotalPrice = (candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2);
  const percentageMinted = 100 * candyMachineData.data.numMintedTokens / COLLECTION_SIZE;

  return (
    <div className="main bg-dark text-white d-flex align-items-center justify-content-center vh-100">
      {isFetchignCmData ?  
        <Waiter spinner={true} msg={"Fetching program data"} customColor={"rgba(255, 159, 156, 0.7)"}/>
      : 
        <>
          {!mintInfo.minting ? 
          <>
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
                {/** Collection Mint Application **/}
                <Col md="6"className="p-3">
                  <Row>
                    {/** COLLECTION INFORMATIONS **/}
                    <Col sm="12" className="position-relative my-2">
                      <div className="collection-info_header d-block-sm d-md-flex align-items-center justify-content-between border-bottom pb-3">
                        <span className="fw-bolder m-0 fs-5">{collectionName}</span>
                        <div className="socials">
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
                          : <FaGlobe size="18" className="mx-2" color="rgba(255,255,255,0.3"/>
                          }
                          <Badge bg="white text-dark mx-2"><p className="m-0 fw-bold fs-6">{candyMachineData.data.mintFee} APT</p></Badge>
                        </div>
                      </div>
                    </Col>
                    {/** RANGE & NUMTOMINT **/}
                    <Col sm="12" className="position-relative my-2">
                      {/** Mint Values */}
                        <div className="collection-info_ToMint">
                          <span className="fw-bolder m-0 fs-5">Cart</span>
                          <div className="mx-auto d-flex align-items-center justify-content-between w-100">
                            <Form.Label className="m-0 fs-6">{collectionName} x {mintInfo.numToMint}</Form.Label> 
                            <Form.Range 
                              bsPrefix={'toto'}
                              min={1} 
                              max={candyMachineData.data.maxMintsPerWallet === !undefined ? 5 : candyMachineData.data.maxMintsPerWallet}
                              value={mintInfo.numToMint} 
                              onChange={(e) => setMintInfo({...mintInfo, numToMint: e.target.value})}
                              />
                          </div>
                          <div className="mx-auto d-flex align-items-center justify-content-between w-100">
                          <Form.Label className="m-0 fs-6">Total</Form.Label> 
                          <Form.Label className="m-0 fs-6">{cartTotalPrice} APT</Form.Label> 
                          </div>
                        </div>
                    </Col>
                  </Row>

                  {/** MINT PHASES **/}
                  <Row>
                    <Col sm="12" className="position-relative my-2">
                      <div className="collection-info_header d-block-sm d-md-flex-column align-items-center justify-content-between">
                        <span className="d-block fw-bolder m-0 fs-5">Mint phase</span>
                      </div>
                      {/** PRESALE */}
                      <div className="my-3 d-block-sl d-md-flex align-items-center justify-content-between">
                        <span>Presale</span>
                        {timeLeftToMint.public === "LIVE" ? 
                          <Badge className="bg-danger text-dark mx-2"><span className="m-0 fw-bold fs-6">ENDED</span></Badge>
                        :
                          <>
                          {timeLeftToMint.presale === "LIVE" 
                          ?
                          <Badge className="bg-danger text-dark mx-2"><span className="m-0 fw-bold fs-6">LIVE</span></Badge> 
                          : 
                          timeLeftToMint.presale.days + " d : " + timeLeftToMint.presale.hours + " h : " + timeLeftToMint.presale.minutes + " m : " + timeLeftToMint.presale.seconds + " s"}
                          </>
                        }
                      </div>                  
                      {/** PUBLIC */}
                      <div className="mt-2 d-block-sl d-md-flex align-items-center justify-content-between">
                        <span>Public</span>
                        {!timeLeftToMint.public === "LIVE" ? 
                          <Badge className="bg-danger white text-dark mx-2"><span className="m-0 fw-bold fs-6">ENDED</span></Badge>
                        :
                          <>
                          {timeLeftToMint.public === "LIVE" 
                          ?  
                          <Badge className="bg-success text-dark mx-2"><span className="m-0 fw-bold fs-6">LIVE</span></Badge> 
                          : 
                          timeLeftToMint.public.days + " d : " + timeLeftToMint.public.hours + " h : " + timeLeftToMint.public.minutes + " m : " + timeLeftToMint.public.seconds + " s"}
                          </>
                        }
                      </div>
                    </Col>
                  </Row>          
                  
                  <Row>
                    <Col sm="12" className="position-relative my-2">
                      <div className="collection-info_header d-block-sm d-md-flex-column align-items-center justify-content-between">
                        <span className="d-block fw-bolder m-0 fs-5">Mint state</span>
                      </div>
                      {/** PROGRESS BAR **/}
                      <div className="mt-2">
                        <ProgressBar bgcolor={percentageMinted < 75 ? "#74f7de" : "rgb(255, 159, 156)"} completed={percentageMinted.toFixed(2)} itemsLeft={candyMachineData.data.numMintedTokens +"/"+ COLLECTION_SIZE}/>
                      </div>
                    </Col>
                  </Row>   

                  {/** MINT BUTTON **/} 
                  <Row>
                    <Col sm="12" className="position-relative my-2">
                      <button className={"btn btn-outline-primary d-block mx-auto mt-3 px-0 py-2 w-100"} onClick={mint} disabled={!canMint}>Mint (max. {candyMachineData.data.maxMintsPerWallet})</button>
                    </Col>
                  </Row>
                </Col>

              </Row>

              {/** TODO */}
              <Modal show={mintInfo.success} onHide={() => setMintInfo({...mintInfo, success: false, mintedNfts: []})} centered size="lg">
                <Modal.Body>
                    <Row className="text-light" style={{flexWrap: "wrap"}}>
                        {mintInfo.mintedNfts.map(mintedNft => 
                        <div key={mintedNft.name} className={"d-flex flex-column col-sm-12 col-md-3 col-lg-4"}>
                            <img className="w-100" src={mintedNft.imageUri === null ? "" : mintedNft.imageUri} />
                            <p>
                              {mintedNft.hash}
                              {mintedNft.name ? mintedNft.name : "false"}
                              </p>
                        </div>
                        )}
                    </Row>
                </Modal.Body>
              </Modal>
            </Container>
          </>

          :
          <Waiter spinner={true} msg={"Minting " + mintInfo.numToMint + " " + collectionName } customColor={"#53fade"}/>
          }
        </>
      }
    </div>
  );
}; 

  export default MintingApplication;