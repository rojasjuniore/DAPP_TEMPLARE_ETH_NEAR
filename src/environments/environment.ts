// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: '#',
  urlWeb: '#',
  configUrlAbi: "/assets/abi/DevToken.json",
  contractAddress: "####",
  infuraId: "#",
  chain: {
    chainId: 137,
    chainIdTest: 80001,
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    rpcMainnet: "https://polygon-mainnet.infura.io/v3/",
    rpcTestnet: "https://polygon-mumbai.infura.io/v3/",
    nativeCurrency: {
      name: "Polygon Mainnet",
      symbol: "MATIC",
      decimals: "18",
    },
    blockExplorerUrls: ["https://explorer.matic.network/"]
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
