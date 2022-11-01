import { React, useEffect, useState } from 'react';

import Waiter from "./Waiter";

import { Container, Col, Row } from "react-bootstrap";
import ProgressBar from "./ProgressBar"
import Modal from "react-bootstrap/Modal"
import { toast } from 'react-toastify';


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
        errorMessage = errorMessage === undefined ? "Unkown error occured. Try again." : errorMessage;

        toast.error(errorMessage);
    } else {
        mintedNfts = await cmHelper.getMintedNfts(aptosClient, candyMachineData.data.tokenDataHandle, candyMachineData.data.cmResourceAccount, collectionName, txInfo)
        toast.success("Minting success!")
    }

    
    setMintInfo({...mintInfo, minting: false, success: mintSuccess, mintedNfts})
  }

  async function fetchCandyMachineData(indicateIsFetching = false) {
    console.log("Fetching candy machine data...")
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

  // useEffect(() => {
  //   setCanMint(wallet.connected && candyMachineData.data.isPublic && parseInt(candyMachineData.data.numUploadedTokens) > parseInt(candyMachineData.data.numMintedTokens) && timeLeftToMint.presale === "LIVE")
  // }, [wallet, candyMachineData, timeLeftToMint])
  useEffect(() => {
    setCanMint(true);
  }, [wallet, candyMachineData, timeLeftToMint])

  const price = (candyMachineData.data.mintFee * mintInfo.numToMint).toFixed(2);
  const percentageMinted = 100 * candyMachineData.data.numMintedTokens / COLLECTION_SIZE;
  
  return (
    <div className="main bg-dark text-white d-flex align-items-center justify-content-center vh-100">
      {/** If Wallet Connected */}
      {wallet.connected ?
        <>
        {isFetchignCmData ?  <Waiter spinner={true} msg={"Fetching data..."} customColor={"rgb(255, 159, 156)"}/>: 
          <>
            {!mintInfo.minting ? 
              <Container className="mw-992">
                <Row className="rounded-4 shadow-light border-row mx-auto">
                  {/** Collection Cover */}
                  <Col md="6">
                    {/**<span className="d-block">{collectionCoverUrl}</span>*/}
                  </Col>
                  {/** Collection Mint Application */}
                  <Col md="6"className="p-3">
                  <div id="collection-info" className="">
                
                    <div className="d-flex align-items-center my-3">
                        <input type="range" max={candyMachineData.data.maxMintsPerWallet === undefined ? 10 : Math.min(candyMachineData.data.maxMintsPerWallet, candyMachineData.data.numUploadedTokens - candyMachineData.data.numMintedTokens)} value={mintInfo.numToMint} onChange={(e) => setMintInfo({...mintInfo, numToMint: e.target.value})} />
                        <button className={""} onClick={mint} disabled={!canMint}>Mint</button>
                        <h5 className="mx-3 mb-0">{candyMachineData.data.mintFee * mintInfo.numToMint} APT</h5>
                        <h5>{candyMachineData.data.numMintedTokens} / {COLLECTION_SIZE}</h5>
                    </div>
                        {/** MINT STATE! */}
                    <div className="d-flex flex-column align-items-center my-3">
                      <h6>{timeLeftToMint.public === "LIVE" ? <span className={""}>LIVE</span> : <span className={""}> {timeLeftToMint.public.days + "d : " + timeLeftToMint.public.hours + "h : " + timeLeftToMint.public.minutes + "m : " + timeLeftToMint.public.seconds + "s"}</span>}</h6>
                    </div>
                    <ProgressBar bgcolor={percentageMinted < 75 ? "rgb(206, 225, 253)" : "rgb(255, 159, 156)"} completed={percentageMinted.toFixed(2)} />
                  </div>
                  </Col>
                </Row>
              </Container>
            :
            <Waiter spinner={true} msg={"Minting"} customColor={"#53fade"}/>
            }
          </>
          }
        </>
        /** If Wallet NOT Connected */
        :
        <Waiter spinner={false} msg={"Please connect your wallet ⚡"}/>
      }
    </div>
  );
}; 

  export default MintingApplication;