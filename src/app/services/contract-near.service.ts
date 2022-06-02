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


  /**
   * Inicializar conexion con el contrato
   * @returns 
   */
  async initContract() {
    // Initialize connection to the NEAR testnet
    const near: any = await connect(
      Object.assign({ 
        deps: { 
          keyStore: new keyStores.BrowserLocalStorageKeyStore() 
        } 
      }, 
      nearConfig
    ));
    
    // console.log("near", near)

    // // Initializing Wallet based Account. It can work with NEAR testnet wallet that
    // // is hosted at https://wallet.testnet.near.org
    this.walletConnection = new WalletConnection(near, 'my-app')

    
    /** Si no se encuentra autenticado - conectar */
    if (!this.walletConnection.isSignedIn()) {
      return this.requestSignIn();
    }

    const walletAccountObj = this.walletConnection.account();
    // console.log("walletAccountObj", walletAccountObj)

    this.accountId = walletAccountObj.accountId;
    // console.log("accountId", this.accountId)

    this.dataStatusSourceNear.next({ accountId: this.accountId });
  }


  /**
   * Solicitar autenticar la wallet
   * TODO: validar parametros
   */
  async requestSignIn() {
    await this.walletConnection.requestSignIn(
      "app.nearcrowd.near", // contract requesting access
      "LANDIAN WHITELIST", // optional
      "http://localhost:4200/home/?id=success", // optional
      "http://localhost:4200/home?failure" // optional
    );
  }
}
