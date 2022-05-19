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

/**
 * TODO: Revisar tipado de llamados en promesas
 */

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
            137: "https://polygon-mainnet.infura.io/v3/" + environment.infuraId,
            80001: "https://polygon-mumbai.infura.io/v3/" + environment.infuraId,
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





  async connectAccount() {
    this._web3Modal.clearCachedProvider();

    this.provider = await this._web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    this.eventsAll()

    this.reInitializating()

  }

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

    await this.getData()
  }

  checkNetwork() {
    this.web3js.eth.net.getId().then(id => {
      // console.log("id", id)
      // console.log("environment.chain.chainId", environment.chain.chainId)
      if (id != environment.chain.chainId) {
        alert('Please switch to the Polygon network');
        this.metamaskService.addEthereumChain()
      }
    })
  }

  async getUserData(){
    const accounts = this.accounts[0];
    const contractAddress = environment.contractAddress;

    const [
      myEther = 0,
      myContractEther,
      balanceOfContract = 0,
      balanceOf = 0,
      getPreSaleCommission,
      getOwner,
      tokenPerEth,
      allowance,
      pause,
      maticUsd = 0,
      proxyDataFeeds,
    ] = await Promise.all([
      this.getBalanceEth(accounts),
      this.getBalanceEth(contractAddress),
      this._method("balanceOf", 'methods', contractAddress),
      this._method("balanceOf", 'methods', accounts),
      this._method("getPreSaleCommission", 'methods'),
      this._method("getOwner", 'methods'),
      this._method("getTokenPerEth", 'methods'),
      this._method("allowance", 'methods', accounts),
      this._method("allowance", 'methods', accounts),
      this.getEthUsd(),
      this._method("proxyDataFeeds", 'methods'),
    ]);

    return {
      accounts,
      contractAddress,
      myEther,
      myContractEther,
      balanceOfContract,
      balanceOf,
      getPreSaleCommission,
      getOwner,
      tokenPerEth,
      allowance,
      pause,
      maticUsd,
      proxyDataFeeds,
      priceToken: (Number(maticUsd) / Number(tokenPerEth)).toFixed(5),
      red: 'MATIC',
    };
  }


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

        // data.myEther = await this.getBalanceEth(this.accounts[0]);
        // console.log("data.myEther", data.myEther)

        // data.balanceOfContract = await this._method("balanceOf", 'methods', data.contractAddress);
        // console.log("data.balanceOfContract", data.balanceOfContract)

        let infoToken = await this._method("getInfoToken", 'methods')
        // console.log("infoToken", infoToken)
        if (infoToken) {
          data.totalSupply = infoToken._totalSupply;
          data.decimals = infoToken._decimals
          data.symbol = infoToken._symbol
          data.name = infoToken._name
        }
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


        this.spinner.hide();

        resolve('ok')


      } catch (err) {
        console.log("err", err)
        alert("Bienvenido ..")
        this.spinner.hide();
        window.location.reload()
        reject(err)
      }

    })




  }

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


  _methods() {
    return this.uToken.methods
  }





  getDataContract() {
    let data: any = localStorage.getItem('_data_contract');
    if (data == "") { return "" }
    return JSON.parse(data)
  }


  /**
   * @notice totalSupply will return the tokens total supply of tokens
   */
  // totalSupply
  // methods
  async _method(method: string, type: string, params?: any) {
    let result;
    // console.log("method", method)
    // console.log("type", type)
    // console.log("params", params)


    if (method == 'allowance') {
      result = await this.uToken[type][method](params, environment.contractAddress).call()
        .catch((error) => {
          console.log("error", error)
        })
    }
    else if (params) {
      result = await this.uToken[type][method](params).call()
        .catch((error) => {
          console.log("error", error)
        })
    } else {
      result = await this.uToken[type][method]().call()
        .catch((error) => {
          console.log("error", error)
        })
    }

    return result;
  }


  /**
* @notice  verify that the address is valid
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


  changePreSaleCommission(amount) {
    try {
      let account = this.accounts[0]
      console.log("account", account)

      this.uToken
        .methods
        .changePreSaleCommission(amount)
        .estimateGas({ from: account })
        .then(async (gas) => {
          console.log("gas", gas);
          // We now have the gas amount, we can now send the transaction
          let result = await this.uToken
            .methods
            .changePreSaleCommission(amount)
            .send({
              from: account,
              gas: gas
            })

          console.log("result", result)
          this.reInitializating()
          alert("changePreSaleCommission exitosos")
        }).catch((error) => {
          alert("Transacción denegada al usuario")
          throw new Error(error);
        });
    } catch (error) {
      console.log("error", error)
      alert("Transacción denegada al usuario")
    }
  }

  changeTokenPerEth(amount) {
    try {
      let account = this.accounts[0]
      console.log("account", account)

      this.uToken
        .methods
        .changeTokenPerEth(amount)
        .estimateGas({ from: account })
        .then(async (gas) => {
          console.log("gas", gas);
          // We now have the gas amount, we can now send the transaction
          let result = await this.uToken
            .methods
            .changeTokenPerEth(amount)
            .send({
              from: account,
              gas: gas
            })

          console.log("result", result)
          this.reInitializating()
          alert("changeTokenPerEth exitosos")
        }).catch((error) => {
          alert("Transacción denegada al usuario")
          throw new Error(error);
        });
    } catch (error) {
      console.log("error", error)
      alert("Transacción denegada al usuario")
    }
  }

  withdraw() {
    try {
      let account = this.accounts[0]
      console.log("account", account)

      this.uToken
        .methods
        .withdraw()
        .estimateGas({ from: account })
        .then(async (gas) => {
          console.log("gas", gas);
          // We now have the gas amount, we can now send the transaction
          let result = await this.uToken
            .methods
            .withdraw()
            .send({
              from: account,
              gas: gas
            })

          console.log("result", result)
          this.reInitializating()
          alert("comprar tokens exitosos")
        }).catch((error) => {
          alert("Transacción denegada al usuario")
          throw new Error(error);
        });
    } catch (error) {
      console.log("error", error)
      alert("Transacción denegada al usuario")
    }
  }


  changeProxy(proxyDataFeed: string) {
    // mumbai: 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada - MATIC / USD	
    // mainNet: 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0 - MATIC / USD	

    try {
      let account = this.accounts[0]
      console.log("account", account)

      this.uToken
        .methods
        .changeProxy(proxyDataFeed)
        .estimateGas({ from: account })
        .then(async (gas) => {
          console.log("gas", gas);
          // We now have the gas amount, we can now send the transaction
          let result = await this.uToken
            .methods
            .changeProxy(proxyDataFeed)
            .send({
              from: account,
              gas: gas
            })

          console.log("result", result)
          this.reInitializating()
          alert("proxyDataFeed exitosos")
        }).catch((error) => {
          alert("Transacción denegada al usuario")
          throw new Error(error);
        });
    } catch (error) {
      console.log("error", error)
      alert("Transacción denegada al usuario")
    }
  }


  transferOwnership(accountTransferOwnership: string) {
    try {
      let account = this.accounts[0]
      console.log("account", account)

      this.uToken
        .methods
        .transferOwnership(accountTransferOwnership)
        .estimateGas({ from: account })
        .then(async (gas) => {
          console.log("gas", gas);
          // We now have the gas amount, we can now send the transaction
          let result = await this.uToken
            .methods
            .transferOwnership(accountTransferOwnership)
            .send({
              from: account,
              gas: gas
            })

          console.log("result", result)
          this.reInitializating()
          alert("transferOwnership exitosos")
        }).catch((error) => {
          alert("Transacción denegada al usuario")
          throw new Error(error);
        });
    } catch (error) {
      console.log("error", error)
      alert("Transacción denegada al usuario")
    }
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
