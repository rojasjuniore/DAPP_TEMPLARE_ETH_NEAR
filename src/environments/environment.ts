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
    accountId: "#",
    merchantId: "#",
    referenceCode: `#${Math.round(Math.random() * 9000000)}`,
    test: "0",
    API_KEY: "#",
    API_LOGIN: "#",
    KEY_PUBLIC: "#",
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
