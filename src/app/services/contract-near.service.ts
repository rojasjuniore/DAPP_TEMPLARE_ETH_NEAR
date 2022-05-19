import { Injectable } from '@angular/core';

import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { Subject } from 'rxjs';
import getConfig from '../../assets/near/config'

const nearConfig = getConfig('mainnet')

@Injectable({
  providedIn: 'root'
})
export class ContractNearService {

  walletConnection: any
  accountId: any

  public dataStatusSourceNear = new Subject<any>();
  dataStatusNear$ = this.dataStatusSourceNear.asObservable();
  constructor() { }


  async initContract() {
    // Initialize connection to the NEAR testnet
    const near: any = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
    console.log("near", near)
    // // Initializing Wallet based Account. It can work with NEAR testnet wallet that
    // // is hosted at https://wallet.testnet.near.org
    this.walletConnection = new WalletConnection(near, 'my-app')

    if (this.walletConnection.isSignedIn()) {
      const walletAccountObj = this.walletConnection.account();
      // console.log("walletAccountObj", walletAccountObj)
      this.accountId = walletAccountObj.accountId;
      console.log("accountId", this.accountId)
      this.dataStatusSourceNear.next({
        accountId: this.accountId,
      })
    } else {
      this.requestSignIn()
    }

  }

  requestSignIn() {
    this.walletConnection.requestSignIn(
      "app.nearcrowd.near", // contract requesting access
      "Example App", // optional
      "http://localhost:4200/home/?id=success", // optional
      "http://localhost:4200/home?failure" // optional
    );
  }
}
