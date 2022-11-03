export const candyMachineAddress = "0x7b86ce220ab3e3851e14644411ce8f05050218ba5f4f4d4af3553bcec130db1c";
export const collectionName = "Gobnuts"; // Case sensitive!
export const collectionDescription = "Gobnuts collection description Gobnuts collection description Gobnuts collection description Gobnuts collection description ";
export const collectionSocials = {
    twitter : "https://twitter.com/gobnutsNFT",
    discord : "https://discord.gg/gobnuts",
    web : ""
}
export const collectionCoverUrl = "https://gobnuts.mypinata.cloud/ipfs/QmPfxMKyPHr9pxdRVM9KoYvxiq9DCaJ2SchzLYxYohUtW8";
export const mode = "mainnet"; // "dev" or "test" or "mainnet"

export let NODE_URL;
export const CONTRACT_ADDRESS = "0xdf5c814388f4162f353e14f6123fcba8f39a958e4a2640e38e9e2c7cdfd2ac1d";

export const COLLECTION_SIZE = 3333
let FAUCET_URL;
if (mode == "dev") {
    NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
    FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
} else if (mode === "test") { 
    NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
    FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
} else {
    NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
    FAUCET_URL = null;
}
