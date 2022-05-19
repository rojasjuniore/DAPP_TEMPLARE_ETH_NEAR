import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import * as WalletConnectProvider from '@walletconnect/web3-provider'
import * as Web3Modal from "web3modal"
import { AbiService } from './abi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddTokenAMetamaskService } from './add-metamask.service';
import { HttpClient } from '@angular/common/http';
import { fromWei, toWei } from '../helpers/utils';
import { approve as APPROVE } from '../helpers/abi';
import { Sweetalert2Service } from './sweetalert2.service';


@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private web3js: any;
  private provider: any;
  public accounts: any;
  _web3Modal: any
  uToken: any
  _atracionesDisponibles: any

  public accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

  public dataStatusSource = new Subject<any>();
  dataStatus$ = this.dataStatusSource.asObservable();

  public setAccountStakes = new Subject<any>();
  accountStakes$ = this.setAccountStakes.asObservable();

  public spinnerConecction = new Subject<any>();
  spinnerConecction$ = this.spinnerConecction.asObservable();

  public timeLockedWalletABI = '/assets/abi/erc20.TimeLockedWallet.json';
  public erc20ABI = '/assets/abi/erc20.json';
  public erc721ABI = '/assets/abi/erc721.json';
  public waitForTransactions = 12000;

  constructor(
    private spinner: NgxSpinnerService,
    private _http: HttpClient,
    public metamaskService: AddTokenAMetamaskService,
    public abiService: AbiService,
    public sweetalert2Srv: Sweetalert2Service,
  ) {

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider.default,
        chainId: environment.chain.chainId,
        options: {
          chainId: environment.chain.chainId,
          infuraId: environment.infuraId, // required,
          rpc: {
            [environment.chain.chainId]: environment.chain.rpc + environment.infuraId,
            // [environment.chain.chainIdTest]: environment.chain.rpcTestnet + environment.infuraId,
          },
        },
        display: {
          description: "Scan with a wallet to connect",
        },
      },
    };

    this._web3Modal = new Web3Modal.default({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "#fbe09e",
        main: "#323232",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }




  /**
   * Conectar Wallet
   */
  async connectAccount() {
    this._web3Modal.clearCachedProvider();

    this.provider = await this._web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    this.checkNetwork();

    this.eventsAll()

    this.reInitializating()
  }


  /**
   * Reconectar y actualizar estado de la wallet
   */
  async reInitializating() {

    /** spinner starts on init */

    // --- temporarily re-initializating these for the effect file 
    this.provider = await this._web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    let token_abi: any = await this.abiService.getABI()

    let token_address = environment.contractAddress;
    // console.log("token_address", token_address)

    this.uToken = new this.web3js.eth.Contract(token_abi, token_address);
    // console.log("uToken", this.uToken.methods)

    this.checkNetwork();

    await this.getData()
  }


  /**
   * Validar estado de la red
   */
  checkNetwork() {
    this.web3js.eth.net.getId().then(id => {
      // console.log("id", id)
      // console.log("environment.chain.chainId", environment.chain.chainId)
      if (id != environment.chain.chainId) {
        alert(`Please switch to the ${environment.chain.chainName}`);
        this.metamaskService.addEthereumChain()
      }
    })
  }


  /**
   * Obtener información de un token
   * @param pair              Pair proveniente del Factory
   * @param pairKey           Identificador del pair 'A' o 'B'
   * @param isNative          Identificador si el token es nativo
   * @returns 
   */
  async getTokenInfo(pair: any, pairKey: string, isNative = false){

    const contract = `token${pairKey}`;
    const decimal = `decimalToken${pairKey}`;

    /**
     * Si el token es nativo
     * - Retorna arreglo formateado con valores por defecto
     */
    if(isNative){
      
      return {
        contract: pair[contract],
        name: environment.chain.nativeCurrency.name,
        symbol: environment.chain.nativeCurrency.symbol,
        decimal: pair[decimal]
      }
    }


    const [
      name,
      symbol,
    ] = await Promise.all([
      this.calculateAndCallCustomABI({
        contractAddress: contract,
        method: 'name',
        params: null,
        callType: 'call',
        urlABI: this.erc20ABI
      }),
      this.calculateAndCallCustomABI({
        contractAddress: contract,
        method: 'symbol',
        params: null,
        callType: 'call',
        urlABI: this.erc20ABI
      })
    ]);

    return {
      contract: pair[contract],
      name,
      symbol,
      decimal: pair[decimal]
    }

  }


  /**
   *  Obtener información de los pares del factory
   * @param dataPair 
   * @param index 
   * @returns 
   */
  async getTokenName(dataPair, index) {
    let obj: any = {};

    const [
      tokenA,
      tokenB
    ] = await Promise.all([
      this.getTokenInfo(dataPair, 'A', dataPair.isNative),
      this.getTokenInfo(dataPair, 'B')
    ])

    obj.tokenA = tokenA;
    obj.tokenB = tokenB;

    obj.active = dataPair.active
    obj.fee = dataPair.fee
    obj.isNative = dataPair.isNative
    obj.amountForTokens = dataPair.amountForTokens
    obj.activeOracle = dataPair.activeOracle
    obj.addressOracle = dataPair.addressOracle
    obj.addressDecimalOracle = dataPair.addressDecimalOracle
    obj.price = fromWei(dataPair.price, 18)
    obj.pairId = index;

    return obj;
  }


  /**
   * Obtener información de la wallet del usuario
   * @returns 
   */
  async getUserData(){
    const accounts = this.accounts[0];
    const contractAddress = environment.contractAddress;

    const [
      myEther = 0,
      myContractEther,
      balanceOfContract = 0,
      // balanceOf = 0,
      // getPreSaleCommission,
      // getOwner,
      // tokenPerEth,
      // allowance,
      // pause,
      // maticUsd = 0,
      // proxyDataFeeds,
    ] = await Promise.all([
      this.getBalanceEth(accounts),
      this.getBalanceEth(contractAddress),
      // this.calculateAndCall('balanceOf')
      // this._method("balanceOf", 'methods', contractAddress),
      // this._method("balanceOf", 'methods', accounts),
      // this._method("getPreSaleCommission", 'methods'),
      // this._method("getOwner", 'methods'),
      // this._method("getTokenPerEth", 'methods'),
      // this._method("allowance", 'methods', accounts),
      // this._method("allowance", 'methods', accounts),
      // this.getEthUsd(),
      // this._method("proxyDataFeeds", 'methods'),
    ]);

    return {
      accounts,
      contractAddress,
      myEther,
      myContractEther,
      balanceOfContract,
      // balanceOf,
      // getPreSaleCommission,
      // getOwner,
      // tokenPerEth,
      // allowance,
      // pause,
      // maticUsd,
      // proxyDataFeeds,
      // priceToken: (Number(maticUsd) / Number(tokenPerEth)).toFixed(5),
      red: environment.chain.nativeCurrency.name,
    };
  }


  /**
   * @name getData
   * @returns 
   */
  async getData() {
    return new Promise(async (resolve, reject) => {
      try {

        if (this.provider) {
          this.spinner.show();
        }

        // console.log("getData")
        let data: any = {}

        // data.contractAddress = environment.contractAddress;
        // data.myContractEther = await this.getBalanceEth(environment.contractAddress);
        // console.log(" data.myContractEther", data.myContractEther)

        const userData = await this.getUserData();
        data = Object.assign({}, data, userData);

        /** Obtener listado de pares */
        // const pairList = await this.pairList();

        // const pairPromise: any = []
        // pairList.forEach((element, index) => {
        //   if (element.active) { pairPromise.push(this.getTokenName(element, index)); }
        // });

        // data.pairList = await Promise.all(pairPromise)

        // data.myEther = await this.getBalanceEth(this.accounts[0]);
        // console.log("data.myEther", data.myEther)

        // data.balanceOfContract = await this._method("balanceOf", 'methods', data.contractAddress);
        // console.log("data.balanceOfContract", data.balanceOfContract)

        // let infoToken = await this._method("getInfoToken", 'methods')
        // // console.log("infoToken", infoToken)
        // if (infoToken) {
        //   data.totalSupply = infoToken._totalSupply;
        //   data.decimals = infoToken._decimals
        //   data.symbol = infoToken._symbol
        //   data.name = infoToken._name
        // }
        // data.balanceOf = await this._method("balanceOf", 'methods', this.accounts[0]);
        // data.accounts = this.accounts[0]

        // data.getPreSaleCommission = await this._method("getPreSaleCommission", 'methods')
        // data.getOwner = await this._method("getOwner", 'methods')
        // data.tokenPerEth = await this._method("getTokenPerEth", 'methods')
        // data.allowance = await this._method("allowance", 'methods', this.accounts[0])
        // data.pause = await this._method("allowance", 'methods', this.accounts[0])

        // data.maticUsd = await this.getEthUsd()

        // data.proxyDataFeeds = await this._method("proxyDataFeeds", 'methods')
        // data.priceToken = (data.maticUsd / data.tokenPerEth).toFixed(5)
        // data.red = 'MATIC'

        if (data) {
          localStorage.setItem('_data_contract', JSON.stringify(data) || "")
          localStorage.setItem('_data_accounts', JSON.stringify(data.accounts) || "")
          this.dataStatusSource.next(data)
          this.accountStatusSource.next([data.accounts] || [])
        }


        console.log({data});
        this.spinner.hide();

        resolve('ok')


      } catch (err) {
        console.log("err", err)
        alert("Bienvenido ..")
        this.spinner.hide();
        window.location.reload()
        reject(err)
      }

    });
  }


  /**
   * @name getEthUsd
   * TODO: validar uso
   * @returns 
   */
  getEthUsd() {
    return new Promise((resolve, reject) => {
      this._http.get(`${environment.API_URL}/walletProvider/getMaticUsd`)
        .subscribe((data: any) => {
          console.log(data);
          resolve(data.results.maticUSd)
        }, err => {
          console.log("err", err)
        });
    })
  }


  /**
   * @name eventsAll
   */
  eventsAll() {
    // Subscribe to accounts change
    this.provider.on("accountsChanged", (accounts: string[]) => {
      console.warn("accountsChanged", accounts);
      this.accountStatusSource.next(accounts)
      window.location.reload()
    });

    // Subscribe to chainId change
    this.provider.on("chainChanged", (chainId: number) => {
      console.log("chainChanged", chainId);
      this.reInitializating()
    });

    // Subscribe to provider connection
    this.provider.on("connect", (info: { chainId: number }) => {
      this.reInitializating()
    });

    // Subscribe to provider disconnection
    this.provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log("disconnect", error);
      window.location.reload()
    });
  }


  /**
   * @name getDataContract
   * @returns 
   */
  getDataContract() {
    let data: any = localStorage.getItem('_data_contract');
    if (data == "") { return "" }
    return JSON.parse(data);
  }


  /**
   * @notice totalSupply will return the tokens total supply of tokens
   */
  // totalSupply
  // methods
  // async _method(method: string, type: string, params?: any) {
  //   let result;
  //   // console.log("method", method)
  //   // console.log("type", type)
  //   // console.log("params", params)


  //   if (method == 'allowance') {
  //     result = await this.uToken[type][method](params, environment.contractAddress).call()
  //       .catch((error) => {
  //         console.log("error", error)
  //       })
  //   }
  //   else if (params) {
  //     result = await this.uToken[type][method](params).call()
  //       .catch((error) => {
  //         console.log("error", error)
  //       })
  //   } else {
  //     result = await this.uToken[type][method]().call()
  //       .catch((error) => {
  //         console.log("error", error)
  //       })
  //   }

  //   return result;
  // }


  /**
   * @name getBalanceEth
   * @notice              verify that the address is valid
   * @param account       Dirección de wallet
   * @returns 
   */
  getBalanceEth(account: string) {
    return new Promise((resolve, reject) => {
      this.web3js.eth.getBalance(account, (err, res) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(this.web3js.utils.fromWei(res, "ether"))
        }
      })
    })
  }


  /**
   * @name changePreSaleCommission
   * @param amount 
   * @returns 
   */
  async changePreSaleCommission(amount) {
    return await this.calculateAndCall('changePreSaleCommission', [amount], 'send');
  }


  /**
   * @name changeTokenPerEth
   * @param amount 
   * @returns 
   */
  async changeTokenPerEth(amount) {
    return await this.calculateAndCall('changeTokenPerEth', [amount], 'send');
  }


  /**
   * @name withdraw
   * @returns 
   */
  async withdraw() {
    return await this.calculateAndCall('withdraw', null, 'send');
  }


  /**
   * @name changeProxy
   * @param proxyDataFeed 
   * @returns 
   */
  async changeProxy(proxyDataFeed: string) {
    return await this.calculateAndCall('changeProxy', [proxyDataFeed], 'send');
  }


  /**
   * @name transferOwnership
   * @param accountTransferOwnership 
   * @returns 
   */
  async transferOwnership(accountTransferOwnership: string) {
    return await this.calculateAndCall('transferOwnership', [accountTransferOwnership], 'send');
  }


  /**
   * @name approve
   * @description                   Tokens
   * @param addresstoken 
   * @param amount 
   * @param contractAddress 
   * @param decimals 
   * @returns 
   */
  async approve(addresstoken: string, amount: string, contractAddress: string, decimals: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const contract: any = await this.abiService.getABIByUrl(this.erc20ABI)
        let accounts = this.accounts[0]
        //@dev cargamos la abi de contracto secundarios con el metodo approve
        let utoken: any = this.getAbiContract([contract.approve], addresstoken)
        //@dev ejecutamos la llamada a la funcion en el contract
        let result = await utoken.methods.approve(contractAddress, toWei(amount, decimals)).send({ from: accounts })
        resolve(result)
      } catch (err) {
        console.log("error", err)
        resolve(false)
      }
    })
  }


  /**
   * @name approveAll
   * @description                       NFT's
   * @param addresstoken 
   * @param contractAddress 
   * @returns 
   */
  async approveAll(addresstoken, contractAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const contract: any = await this.abiService.getABIByUrl(this.erc721ABI);
        console.log("contract", contract[49])
        let accounts = this.accounts[0]
        //@dev cargamos la abi de contracto secundarios con el metodo approve
        let utoken: any = this.getAbiContract([contract[49]], addresstoken)
        //@dev ejecutamos la llamada a la funcion en el contract
        let result = await utoken.methods.setApprovalForAll(contractAddress, true).send({ from: accounts })
        resolve(result)
      } catch (err) {
        console.log("error", err)
        resolve(false)
      }
    })
  }


  /**
   * @name isApprovedForAll
   * @description                           NTF's
   * @param addresstoken 
   * @param contractAddress 
   * @returns 
   */
  async isApprovedForAll(addresstoken, contractAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const contract: any = await this.abiService.getABIByUrl(this.erc721ABI);
        console.log("contract", contract[30])
        let accounts = this.accounts[0]

        console.log("addresstoken", addresstoken)
        console.log("contractAddress", contractAddress)


        //@dev cargamos la abi de contracto secundarios con el metodo approve
        let utoken: any = this.getAbiContract([contract[30]], addresstoken)
        //@dev ejecutamos la llamada a la funcion en el contract
        let result = await utoken.methods.isApprovedForAll(accounts, contractAddress).call({ from: accounts })
        resolve(result)
      } catch (err) {
        console.log("error", err)
        resolve(false)
      }
    })
  }


  /**
   * @name getApproveNFT
   * @description                       Approve Tokens
   * @param addressNft 
   * @param nftId 
   * @param contractAddress 
   * @returns 
   */
  getApproveNFT(addressNft: string, nftId: number, contractAddress: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const contract: any = await this.abiService.getABIByUrl(this.erc721ABI);
        let accounts = this.accounts[0]
        //@dev cargamos la abi de contracto secundarios con el metodo approve
        let utoken: any = this.getAbiContract([contract[49]], addressNft)
        // @dev verificamos el gas de la transaccion
        let _gas = await utoken
          .methods
          .approve(addressNft, nftId)
          .estimateGas({ from: accounts })
        //@dev ejecutamos la llamada a la funcion en el contract
        let result = await utoken.methods
          .approve(contractAddress, nftId)
          .send({ from: accounts, gas: _gas })
          .on('transactionHash', (hash) => {
            console.log("hash", hash)
            setTimeout(() => {
              resolve(true)
            }, this.waitForTransactions)
          })
          .on('receipt', (receipt) => {
            console.log("receipt", receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            console.log("confirmationNumber", confirmationNumber)
            console.log("receipt", receipt)
          })
          .on('error', (err) => {
            console.log("error", err.message)
            this.sweetalert2Srv.showError(err.message, 2)
            this.spinnerConecction.next(false)
          })
        resolve(result)
      } catch (err) {
        console.log("error", err)
        this.sweetalert2Srv.showError("Error", 2)
        console.log("error", err)
        resolve(false)
      }
    })
  }


  /**
   * @name getApproveTokenAddress
   * @param addresstoken 
   * @param amount 
   * @param decimals 
   * @param contractAddress 
   * @returns 
   */
  getApproveTokenAddress(addresstoken: string, amount: string, decimals, contractAddress) {
    return new Promise(async (resolve, reject) => {
      try {

        // cargamos la abi de contracto secundarios con el metodo approve
        let utoken = this.getAbiContract(APPROVE, addresstoken)

        let account = this.accounts[0]
        let tokenTotal = toWei(amount, decimals)
        console.warn("tokenTotal", tokenTotal)

        // hacemmos la consulta
        let _gas = await utoken
          .methods
          .approve(contractAddress, tokenTotal)
          .estimateGas({ from: account })

        console.log("_gas", _gas)
        // We now have the gas amount, we can now send the transaction
        utoken
          .methods
          .approve(contractAddress, tokenTotal)
          .send({
            from: account,
            gas: _gas
          })
          .on('transactionHash', (hash) => {
            console.log("hash", hash)
            setTimeout(() => {
              resolve(true)
            }, this.waitForTransactions)
          })

          .on('receipt', (receipt) => {
            console.log("receipt", receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            console.log("confirmationNumber", confirmationNumber)
            console.log("receipt", receipt)
          })
          .on('error', (err) => {
            console.log("error", err.message)
            this.sweetalert2Srv.showError(err.message, 2)
            this.spinnerConecction.next(false)
          })


      } catch (err) {
        console.log("error", err)
        this.sweetalert2Srv.showError("Error", 2)
        resolve(false)
      }

    });
  }


  /**
   * @name logout
   */
  async logout() {
    await this._web3Modal.clearCachedProvider();
    this.provider = null

    localStorage.setItem('_data_accounts', "")
    localStorage.setItem('_data_contract', "")
    this.accountStatusSource.next(null)
    this.dataStatusSource.next(null)
    window.location.reload()
  }




  /* =======================================================
   *                         Withdraw   
   * ===================================================== */

  /**
   * @name withdrawMaticOwner
   * @param amount 
   */
   async withdrawMaticOwner(amount) {
    return await this.calculateAndCall('withdrawMaticOwner', [amount], 'send');
  }


  /**
   * @name withdrawTokenOnwer
   * @param token 
   * @param amount 
   */
  async withdrawTokenOnwer(token, amount) {
    return await this.calculateAndCall('withdrawTokenOnwer', [token, amount], 'send');
  }




  /* =======================================================
   *                    TransferHistory   
   * ===================================================== */


  /**
   * @name daySellLimit
   */
  async daySellLimit() {
    return await this.calculateAndCall('daySellLimit', null, 'call');
  }


  /**
   * @name dayBuyLimit
   */
  async dayBuyLimit() {
    return await this.calculateAndCall('dayBuyLimit', null, 'call');
  }


  /**
   * @name vaultAddress
   */
  async vaultAddress() {
    return await this.calculateAndCall('vaultAddress', null, 'call');
  }


  /**
   * @name limitSell
   * @param address 
   */
  async limitSell(address) {
    return await this.calculateAndCall('limitSell', [address], 'send');
  }


  /**
   * @name limitBuy
   * @param buyAmount 
   */
  async limitBuy(buyAmount) {
    return await this.calculateAndCall('limitBuy', [buyAmount], 'send');
  }


  /**
   * @name setSellLimit
   * @param newLimit 
   */
  async setSellLimit(newLimit) {
    return await this.calculateAndCall('setSellLimit', [newLimit], 'send');
  }


  /**
   * @name setBuyLimit
   * @param newLimit 
   */
  async setBuyLimit(newLimit) {
    return await this.calculateAndCall('setBuyLimit', [newLimit], 'send');
  }


  /**
   * @name setVaultAddress
   * @param address 
   */
  async setVaultAddress(address) {
    return await this.calculateAndCall('setVaultAddress', [address], 'send');
  }




  /* =======================================================
   *                        Oracle   
   * ===================================================== */


  /**
   * @name getLatestPrice
   * @param oracle 
   * @param decimals 
   */
  async getLatestPrice(oracle, decimals) {
    return await this.calculateAndCall('getLatestPrice', [oracle, decimals], 'call');
  }




  /* =======================================================
   *                        Administered   
   * ===================================================== */


  /**
   * @name USER_ROLE
  * @param oracle 
  */
  async USER_ROLE() {
    return await this.calculateAndCall('USER_ROLE', null, 'call');
  }


  /**
   * @name isAdmin
   * @returns 
   */
  async isAdmin(){
    const [ account ] = this.accounts;
    return await this.calculateAndCall('isAdmin', [ account ], 'call');
  }


  /**
   * @name isUser
   * @returns 
   */
  async isUser(){
    const [ account ] = this.accounts;
    return await this.calculateAndCall('isUser', [ account ], 'call');
  }


  /**
   * @name addUser
   * @param account
   * @returns 
   */
  async addUser(account: string){
    return await this.calculateAndCall('addUser', [ account ], 'send');
  }


  /**
   * @name addAdmin
   * @param account
   * @returns 
   */
  async addAdmin(account: string){
    return await this.calculateAndCall('addAdmin', [ account ], 'send');
  }


  /**
   * @name removeUser
   * @param account
   * @returns 
   */
  async removeUser(account: string){
    return await this.calculateAndCall('removeUser', [ account ], 'send');
  }


  /**
   * @name renounceAdmin
   * @returns 
   */
  async renounceAdmin(){
    const [ account ] = this.accounts;
    return await this.calculateAndCall('renounceAdmin', [ account ], 'send');
  }




  /* =======================================================
   *                        Chainalysis   
   * ===================================================== */


  /**
   * @name SANCTIONS_CONTRACT
   * @returns 
   */
   async SANCTIONS_CONTRACT() {
    return await this.calculateAndCall('SANCTIONS_CONTRACT', null, 'call');
  }


  /**
   * @name stateSanctions
   * @returns 
   */
  async stateSanctions() {
    return await this.calculateAndCall('stateSanctions', null, 'call');
  }


  /**
   * @name Sanctions
   * @param address
   * @returns 
   */
  async Sanctions(address) {
    return await this.calculateAndCall('Sanctions', [ address ], 'call');
  }


  /**
   * @name setAddressSanctions
   * @param address
   * @returns 
   */
  async setAddressSanctions(address) {
    return await this.calculateAndCall('setAddressSanctions', [ address ], 'send');
  }


  /**
   * @name setStateSanctions
   * @param status
   * @returns 
   */
  async setStateSanctions(status) {
    return await this.calculateAndCall('setStateSanctions', [ status ], 'send');
  }




  /* =======================================================
   *                        FactorySwap   
   * ===================================================== */


  /**
   * @name pairCount
   */
  async pairCount() {
    return await this.calculateAndCall('pairCount', null, 'call');
  }


  /**
   * @name registerPair
   * @param pair
   * @param pair._price
   * @param pair._tokenA
   * @param pair._decimalTokenA
   * @param pair._tokenB
   * @param pair._decimalTokenB
   * @param pair._amountForTokens
   * @param pair._fee
   * @param pair._activeOracle
   * @param pair._addressOracle
   * @param pair._addressDecimalOracle 
   * @param pair._active
   */
  async registerPair(pair) {
    return await this.calculateAndCall('registerPair', pair, 'send');
  }


  /**
   * @name pairList
   */
  async pairList() {
    return await this.calculateAndCall('pairList', null, 'call');
  }


  /**
   * @name pairChange
   * @param pair 
   * @param pair._type
   * @param pair._decimal
   * @param pair._id
   * @param pair._bool
   * @param pair._address
   * @param pair._value
   */
  async pairChange(pair) {
    return await this.calculateAndCall('pairChange', pair, 'send');
  }

  /**
   * @name getPair
   * @param pairId 
   * @returns 
   */
  async getPair(pairId: any) {
    return await this.calculateAndCall('getPair', [ pairId ], 'call');
  }




  /* =======================================================
   *                        FactoryStakeToken   
   * ===================================================== */
  

  /**
   * @name stakeCountToken
   * @returns 
   */
  async stakeCountToken() {
    return await this.calculateAndCall('stakeCountToken', null, 'call');
  }
  

  /**
   * @name registerStakeToken
   * @param params
   * @param params.nameAddressToken
   * @param params.addressToken
   * @param params.rewardRate
   * @param params.rewardPerMonth
   * @param params.day
   * @param params.minStaked
   * @param params.status
   * @returns 
   */
  async registerStakeToken(params) {
    return await this.calculateAndCall('registerStakeToken', params, 'send');
  }


  /**
   * @name stakeListTokenToken
   * @returns 
   */
  async stakeListTokenToken() {
    return await this.calculateAndCall('stakeListTokenToken', null, 'call');
  }


  /**
   * @name activeStakeToken
   * @param id
   * @param status
   * @returns 
   */
  async activeStakeToken(id, status) {
    return await this.calculateAndCall('activeStakeToken', [id, status], 'send');
  }


  /**
   * @name getDaysToken
   * @param day
   * @returns 
   */
  async getDaysToken(day) {
    return await this.calculateAndCall('getDaysToken', [day], 'call');
  }


  /**
   * @name getStakeToken
   * @param id
   * @returns 
   */
  async getStakeToken(id) {
    return await this.calculateAndCall('getStakeToken', [id], 'call');
  }


  /* =======================================================
   *                        FactoryStakeNft   
   * ===================================================== */


  /**
   * @name stakeNftCount
   * @returns 
   */
  async stakeNftCount() {
    return await this.calculateAndCall('_stakeCount', null, 'call');
  }

  
  /**
   * @name registerStakeNft
   * @param params
   * @param params._nameAddressNft
   * @param params._addressNft
   * @param params._nameAddressTokenReward
   * @param params._addressTokenReward
   * @param params._rewardTotal
   * @param params._day
   * @param params._status
   * @returns 
   */
  async registerStakeNft(params) {
    return await this.calculateAndCall('registerStake', [params], 'send');
  }

  
  /**
   * @name stakeNftList
   * @returns 
   */
   async stakeNftList() {
    return await this.calculateAndCall('stakeList', null, 'call');
  }


  /**
   * @name getStake
   * @param id
   * @returns 
   */
   async getStake(id) {
    return await this.calculateAndCall('getStake', [id], 'call');
  }


  /**
   * @name activateStakedNft
   * @param id
   * @param status
   * @returns 
   */
   async activateStakedNft(id, status) {
    return await this.calculateAndCall('activateStaked', [id, status], 'call');
  }


  /* =======================================================
   *                        Swap   
   * ===================================================== */


  /**
   * @name BuyTokensFor
   * @param pairId 
   * @param tokenAmount 
   */
   async BuyTokensFor(pairId, tokenAmount) {
    return await this.calculateAndCall('BuyTokensFor', [pairId, tokenAmount], 'send');
  }


  /**
   * @name SellTokensFor
   * @param pairId 
   * @param tokenAmount 
   */
  async SellTokensFor(pairId, tokenAmount) {
    return await this.calculateAndCall('SellTokensFor', [pairId, tokenAmount], 'send');
  }


  /**
   * @name balanceOf
   * @param token 
   * @param address 
   */
  async balanceOf(token, address) {
    return await this.calculateAndCall('balanceOf', [token, address], 'call');
  }




  /* =======================================================
   *                        StakedToken   
   * ===================================================== */


  /**
   * @name stakeToken
   * @param amountTokens 
   * @param stakeId 
   */
  async stakeToken(amountTokens, stakeId) {
    return await this.calculateAndCall('stakeToken', [amountTokens, stakeId], 'send');
  }

  
  /**
   * @name withdrawStake
   * @param amountTokens 
   * @param stakeId 
   */
  async withdrawStake(amountTokens, stakeId) {
    return await this.calculateAndCall('withdrawStake', [amountTokens, stakeId], 'send');
  }


  /**
   * @name totalStakesToken
   */
  async totalStakesToken() {
    return await this.calculateAndCall('totalStakesToken', null, 'call');
  }


  /* =======================================================
   *                        StakedNft   
   * ===================================================== */


  /**
   * @name stakeNft
   * @param stakeId
   * @param tokenId
   */
  async stakeNft(stakeId, tokenId) {
    return await this.calculateAndCall('stakeNft', [stakeId, tokenId], 'send');
  }


  /**
   * @name withdrawNFTStake
   * @param index
   */
  async withdrawNFTStake(index) {
    return await this.calculateAndCall('withdrawNFTStake', [index], 'send');
  }




  /* =======================================================
   *                        TimeLockedWalletFactory   
   * ===================================================== */


  /**
   * @name newTimeLockedWallet
   * @param params
   * @param params._token
   * @param params._owner
   * @param params._amount
   * @param params._unlockDate
   */
   async newTimeLockedWallet(params) {
    return await this.calculateAndCall('newTimeLockedWallet', params, 'send');
  }


  /**
   * @name fundRemover
   * @param params
   * @param params._token
   * @param params._account
   * @param params._amount
   */
   async fundRemover(params) {
    return await this.calculateAndCall('fundRemover', params, 'send');
  }


  /**
   * @name getWallets
   * @param userAddress
   */
   async getWallets(userAddress) {
    return await this.calculateAndCall('getWallets', [userAddress], 'send');
  }
  
  
  /* =======================================================
  *                        TimeLockedWallet   
  * ===================================================== */


  /**
   * @name timeLockedWallet_creator
   * @param address
   */
  async tlw_creator(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'creator',
      callType: 'call',
      urlABI: this.timeLockedWalletABI
    });
  }

  
  /**
   * @name timeLockedWallet_walletOwner
   * @param address
   */
  async tlw_walletOwner(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'walletOwner',
      callType: 'call',
      urlABI: this.timeLockedWalletABI
    });
  }

  
  /**
   * @name timeLockedWallet_amount
   * @param address
   */
  async tlw_amount(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'amount',
      callType: 'call',
      urlABI: this.timeLockedWalletABI
    });
  }
 
  
  /**
   * @name timeLockedWallet_unlockDate
   * @param address
   */
  async tlw_unlockDate(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'unlockDate',
      callType: 'call',
      urlABI: this.timeLockedWalletABI
    });
  }

  
  /**
   * @name timeLockedWallet_createdAt
   * @param address
   */
  async tlw_createdAt(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'createdAt',
      callType: 'call',
      urlABI: this.timeLockedWalletABI
    });
  }


  /**
   * @name timeLockedWallet_token
   * @param address
   */
  async tlw_token(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'token',
      callType: 'call',
      urlABI: this.timeLockedWalletABI
    });
  }

  /**
   * @name timeLockedWallet_removeAdvisor
   * @param address
   */
  async tlw_removeAdvisor(address, account) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'removeAdvisor',
      callType: 'send',
      params: { account },
      urlABI: this.timeLockedWalletABI
    });
  }

  /**
   * @name timeLockedWallet_withdraw
   * @param address
   */
  async tlw_withdraw(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'withdraw',
      callType: 'send',
      urlABI: this.timeLockedWalletABI
    });
  }


  /**
   * @name timeLockedWallet_info
   * @param address
   */
  async tlw_info(address) {
    return await this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'info',
      callType: 'call',
      urlABI: this.timeLockedWalletABI
    });
  }
 

  /** ===============================================================
   *               Méthodo genérico para llamadas al SC
   * ================================================================
   * @param method 
   * @param params 
   * @param callType        'call' and 'send' 
   */
  async calculateAndCall(method: any, params?: any, callType = 'send', optionals: any = {}) {
    try {

      const contractMethod = (!params)
        ? this.uToken.methods[method]()
        : this.uToken.methods[method](...params)

      if(callType === 'send'){

        const [ account ] = this.accounts;

        const gasFee = await contractMethod.estimateGas( optionals );
        console.log("gas", gasFee);

        optionals.gas = gasFee;
        optionals.from = account;
      }

      const result = await contractMethod[callType]( optionals );
      console.log("result", result);

      // this.sweetAlertSrv.showSuccess('Transacción exitosa');

      if (callType === 'send') { this.reInitializating(); }

      return result;

    } catch (err: any) {
      // this.sweetAlertSrv.showError('Transacción fallida');
      console.log('Error on ContractService@calculateAndCall', err);
      throw new Error(err);
    }
  }


  /** ===============================================================
   *       Méthodo genérico para llamadas al SC personalizado
   * ================================================================
   * @param data 
   * @param data.contractAddress 
   * @param data.method 
   * @param data.params 
   * @param data.callType           'call' / 'send'
   * @param data.optionals 
   * @param data.urlABI 
   */
  async calculateAndCallCustomABI(data: any) {
    const {
      contractAddress,
      method,
      params = null,
      callType = 'send',
      optionals = {},
      urlABI = this.erc20ABI
    } = data;

    try {

      // Cargar ABI del contrato
      const contractABI: any = await this.abiService.getABIByUrl(urlABI);

      // cargamos la abi de contracto secundarios con el metodo que necesitamos
      const uToken = this.getAbiContract([contractABI[method]], contractAddress);

      const contractMethod = (!params)
        ? uToken.methods[method]()
        : uToken.methods[method](...params);

      if(callType === 'send'){

        const [ account ] = this.accounts;

        const gasFee = await contractMethod.estimateGas( optionals );
        console.log("gas", gasFee);

        optionals.gas = gasFee;
        optionals.from = account;
      }

      const result = await contractMethod[callType]( optionals );
      console.log("result", result);

      return result;

    } catch (err: any) {
      console.log('Error on ContractService@calculateAndCallCustomABI', err);
      throw new Error(err);
    }
  }


  /**
   * Obteber nueva instancia WEB3 de un SC a través del ABI ingresado
   * @param token_abi             ABI Cargado
   * @param token_address         Dirección del SC
   * @returns 
   */
  getAbiContract(token_abi, token_address) {
    let uToken: any = new this.web3js.eth.Contract(token_abi, token_address);
    return uToken;
  }

}
