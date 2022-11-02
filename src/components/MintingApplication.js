import { React, useEffect, useState } from 'react';

import Waiter from "./Waiter";

import { Container, Col, Row } from "react-bootstrap";
import ProgressBar from "./ProgressBar"
import Modal from "react-bootstrap/Modal"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { AptosClient } from "aptos";
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import cmHelper from "./helpers/candyMachineHelper"
import {candyMachineAddress, collectionName, collectionCoverUrl, NODE_URL, CONTRACT_ADDRESS, COLLECTION_SIZE} from "./helpers/candyMachineInfo"

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
              <Row className="rounded-4 shadow border-row mx-auto">
                {/** Collection Cover */}
                <Col md="6" className={"py-0 px-0 d-flex justify-content-center align-items-center"}>
                  {collectionCoverUrl ? 
                    <img className="w-100" src={collectionCoverUrl}/>
                    :
                    <Waiter spinner={true} customColor={"rgba(255, 159, 156, 0.7)"}/>
                  }
                </Col>
                {/** Collection Mint Application */}
                <Col md="6"className="p-3">
                  <div className="">
                    {mintInfo.numToMint}
                      <input min={1} max={candyMachineData.data.maxMintsPerWallet === undefined ? 10 : Math.min(candyMachineData.data.maxMintsPerWallet, candyMachineData.data.numUploadedTokens - candyMachineData.data.numMintedTokens)} value={mintInfo.numToMint} onChange={(e) => setMintInfo({...mintInfo, numToMint: e.target.value})} />
                      <h5>Item price :  {candyMachineData.data.mintFee} APT</h5>
                      <h5>Total : {price} APT</h5>
                      <h5>Minted : {candyMachineData.data.numMintedTokens} / {COLLECTION_SIZE}</h5>
                  </div>
                    
                  {/** MINT STATE! */}
                  {timeLeftToMint.public === "LIVE" ? <span className={""}>LIVE</span> : <span className={""}> {timeLeftToMint.public.days + "d : " + timeLeftToMint.public.hours + "h : " + timeLeftToMint.public.minutes + "m : " + timeLeftToMint.public.seconds + "s"}</span>}

                  {/** PROGRESS BAR */}
                  <ProgressBar bgcolor={percentageMinted < 75 ? "#74f7de" : "rgb(255, 159, 156)"} completed={percentageMinted.toFixed(2)} itemsLeft={candyMachineData.data.numMintedTokens +"/"+ COLLECTION_SIZE}/>
                  
                  {/** MINT BUTTON */}
                  <button className={"btn btn-outline-primary d-block mx-auto mt-3 px-0 py-2 w-100"} onClick={mint} disabled={!canMint}>Mint</button>

                </Col>
              </Row>
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