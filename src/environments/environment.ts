// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// https://www.rapidtables.com/convert/number/hex-to-decimal.html

export const environment = {
  production: false,
  API_URL: 'https://62sijfwdjq.us-east-1.awsapprunner.com/api/v1/',
  urlWeb: '#',
  configUrlAbi: "/assets/abi/DevToken.json",
  contractAddress: "####",
  infuraId: "#",
  urlTokenLogo: "#",
  chain: {

    // Testnet
    chainId: 97,
    chainIdMetamask: "0x61",
    chainName: "BNB Smart Chain Testnet",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],

    // Mainnnet 
    // chainId: 56,
    // chainIdMetamask: "0X38",
    // chainName: "BNB Smart Chain Mainnet",
    // rpc: "https://bsc-dataseed1.binance.org/",
    // rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    // blockExplorerUrls: ["https://bscscan.com/"],

    nativeCurrency: {
      network: "Binance Smart Chain",
      name: "BNB",
      symbol: "BNB",
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
