// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  API_URL: '#',
  urlWeb: '#',
  configUrlAbi: "/assets/abi/DevToken.json",
  contractAddress: "####",
  infuraId: "#",
  urlTokenLogo: "#",
  chain: {

    // Testnet
    // chainId: 80001,
    // chainIdMetamask: "0x13881",
    // chainName: "Polygon Testnet",
    // rpc: "https://polygon-mumbai.infura.io/v3/",
    // rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
    // blockExplorerUrls: ["https://mumbai.polygonscan.com/"],

    // Mainnnet 
    chainId: 137,
    chainIdMetamask: "0X89",
    chainName: "Polygon Mainnet",
    rpc: "https://polygon-mainnet.infura.io/v3/",
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],

    nativeCurrency: {
      name: "Polygon Mainnet",
      symbol: "MATIC",
      decimals: "18",
    },
  },
};