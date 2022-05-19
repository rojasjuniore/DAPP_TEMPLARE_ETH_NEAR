// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// https://www.rapidtables.com/convert/number/hex-to-decimal.html

export const environment = {
  production: false,
  API_URL: '#',
  urlWeb: '#',
  configUrlAbi: "/assets/abi/DevToken.json",
  contractAddress: "####",
  infuraId: "#",
  urlTokenLogo: "#",
  chain: {

    // Testnet
    chainId: 80001,
    chainIdMetamask: "0x13881",
    chainName: "Polygon Testnet",
    rpc: "https://polygon-mumbai.infura.io/v3/",
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],

    // Mainnnet 
    // chainId: 137,
    // chainIdMetamask: "0X89",
    // chainName: "Polygon Mainnet",
    // rpc: "https://polygon-mainnet.infura.io/v3/",
    // rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    // blockExplorerUrls: ["https://polygonscan.com/"],

    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: "18",
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
