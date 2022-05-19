export const environment = {
  production: false,
  API_URL: '#',
  urlWeb: '#',
  configUrlAbi: "/assets/abi/DevToken.json",
  contractAddress: "#",
  infuraId: "##",
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
