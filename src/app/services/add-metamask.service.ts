import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddTokenAMetamaskService {

  token: any
  constructor() { }

  async addToken() {
    try {

      let data1: any = localStorage.getItem('_data_contract')
      this.token = JSON.parse(data1);
      console.log("this.token ", this.token)

      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: this.token.contractAddress, // The address that the token is at.
            symbol: this.token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: this.token.decimals, // The number of decimals in the token
            image: environment.urlTokenLogo, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks!');
        alert('Thanks!');
      } else {
        console.log('Your loss!');
        alert('Your loss!');
      }
    } catch (error) {
      alert(JSON.stringify(error));
      console.log(error);
    }
  }

  async addEthereumChain() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: environment.chain.chainId }],
      });
    } catch (error: any) {
      console.log("error", error)
      if (error.code === 4902) {
        try {
          const wasAdded = await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: environment.chain.chainId,
                chainName: environment.chain.chainName,
                nativeCurrency: environment.chain.nativeCurrency,
                rpcUrls: [ environment.chain.rpcUrls ],
                blockExplorerUrls: [ environment.chain.blockExplorerUrls ],
              },
            ],
          });

          if (wasAdded) {
            console.log('Thanks!');
            alert('Thanks!');
          } else {
            console.log('Your loss!');
            alert('Your loss!');
          }
        } catch (error: any) {
          console.log("error", error)
          alert(JSON.stringify(error));
        }
      }
    }
  }
}
