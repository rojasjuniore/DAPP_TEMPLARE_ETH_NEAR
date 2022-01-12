// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'https://mind-api.uc.r.appspot.com',
  urlWeb: 'https://mplus.mindworld.io/',
  configUrlAbi: "/assets/abi/DevToken.json",
  contractAddress: "0x3dD5f701A28E035b585e3AFF6501AbadaDA1e29e",
  infuraId: "629c02c877174fcfb764daa34d3b0dbb",
  chain: {
    chainId: "137",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    nativeCurrency: {
      name: "Polygon Mainnet",
      symbol: "MATIC",
      decimals: "18",
    },
    blockExplorerUrls: ["https://explorer.matic.network/"]
  },
  payu: {
    url_payu: "https://checkout.payulatam.com/ppp-web-gateway-payu/",
    accountId: "966778",
    merchantId: "959064",
    referenceCode: `MIND${Math.round(Math.random() * 9000000)}`,
    test: "0",
    API_KEY: "nmhB33UHrDj4KMT853Z5JXBFw0",
    API_LOGIN: "s1PMg344Jp5BjR7",
    KEY_PUBLIC: "PKmseJn6HV0q4fx09A35Q1gzyC",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
