"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLLECTION_SIZE = exports.CONTRACT_ADDRESS = exports.NODE_URL = exports.mode = exports.collectionCoverUrl = exports.collectionName = exports.candyMachineAddress = void 0;
var candyMachineAddress = "0x7b86ce220ab3e3851e14644411ce8f05050218ba5f4f4d4af3553bcec130db1c";
exports.candyMachineAddress = candyMachineAddress;
var collectionName = "Gobnuts"; // Case sensitive!

exports.collectionName = collectionName;
var collectionCoverUrl = "https://gobnuts.mypinata.cloud/ipfs/QmPfxMKyPHr9pxdRVM9KoYvxiq9DCaJ2SchzLYxYohUtW8";
exports.collectionCoverUrl = collectionCoverUrl;
var mode = "mainnet"; // "dev" or "test" or "mainnet"

exports.mode = mode;
var NODE_URL;
exports.NODE_URL = NODE_URL;
var CONTRACT_ADDRESS = "0xdf5c814388f4162f353e14f6123fcba8f39a958e4a2640e38e9e2c7cdfd2ac1d";
exports.CONTRACT_ADDRESS = CONTRACT_ADDRESS;
var COLLECTION_SIZE = 3333;
exports.COLLECTION_SIZE = COLLECTION_SIZE;
var FAUCET_URL;

if (mode == "dev") {
  exports.NODE_URL = NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
  FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
} else if (mode === "test") {
  exports.NODE_URL = NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
  FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
} else {
  exports.NODE_URL = NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
  FAUCET_URL = null;
}