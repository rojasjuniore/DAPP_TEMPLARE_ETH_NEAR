export const environment = {
  production: false,
  API_URL: '#',
  urlWeb: '#',
  configUrlAbi: "/assets/abi/DevToken.json",
  contractAddress: "#",
  infuraId: "##",
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
