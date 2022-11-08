export const candyMachineAddress = "0x8287156192962b7858eaf36202b46cc1b9c0b0f88406ca37f87b85425bb7a3b6";
export const collectionName = "Pixel Nuts"; // Case sensitive!
export const collectionDescription = "";
export const collectionSocials = {
    twitter : "https://twitter.com/gobnutsNFT",
    discord : "https://discord.gg/gobnuts",
    web : null
}
export const collectionCoverUrl = "https://gobnuts.mypinata.cloud/ipfs/QmUeNXaeZhviZejMCihXGf4UNrdvYj8ae6VcBvFpBeDUmL";
export const collectionBigCoverUrl = "https://gobnuts.mypinata.cloud/ipfs/QmcoDT7yGr8dGVcGNiTVgdhB9EamBNhR5LztGkAptjQ1FU";

export const mode = "dev"; // "dev" or "test" or "mainnet"
export const MaxMint = 5;
export let NODE_URL;
export const CONTRACT_ADDRESS = "0x5b71b400de0767bcec88464c33a0c74c839737206883a9379252f4907b8bf30e";

export const COLLECTION_SIZE = 1111;
export const SERVICE_NAME = "ftmpad"

let FAUCET_URL;
if (mode == "dev") {
    NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
    FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
} else if (mode == "test") { 
    NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
    FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
} else {
    NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
    FAUCET_URL = null;
}
 