import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { toWei, toBN } from '../helpers/utils';
import { ContractService, } from './contract.service';
import BigNumber from "bignumber.js";

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    private spinner: NgxSpinnerService,
    public contractService: ContractService) {
  }


  async buyTokens(inviter: string, ether: string) {

    try {
      this.spinner.show();
      let account = this.contractService.accounts[0]
      let totalEther = toWei(ether)

      console.log("totalEther", totalEther)
      console.log("account", account)
      console.log("inviter", inviter)

      this.contractService
        .uToken
        .methods
        .buyTokens(inviter)
        .estimateGas({ from: account, value: totalEther })
        .then(async (gas) => {
          console.log("gas", gas);
          // We now have the gas amount, we can now send the transaction
          let result = await this
            .contractService
            .uToken
            .methods
            .buyTokens(inviter)
            .send({
              from: account,
              value: totalEther,
              gas: gas
            })

          console.log("result", result)
          this.contractService.reInitializating()
          alert("comprar tokens exitosos")
          this.spinner.hide();
        }).catch((error) => {
          this.spinner.hide();
          alert("Transacción denegada al usuario")
          throw new Error(error);
        });
    } catch (error) {
      console.log("error", error)
      alert("Transacción denegada al usuario")
    }


  }





  async sellTokens(token: string) {
    this.spinner.show();

    let account = this.contractService.accounts[0]
    let tokenTotal = toWei(token)

    this.contractService
      .uToken
      .methods
      .sellTokens(tokenTotal)
      .estimateGas({
        from: account,
      })
      .then(async (gas) => {

        console.log("gas", gas);

        // We now have the gas amount, we can now send the transaction
        let result = await
          this.contractService
            .uToken
            .methods
            .sellTokens(tokenTotal)
            .send({
              from: account,
              gas: gas
            })

        console.log("result", result)
        this.contractService.reInitializating()
        alert("buy tokens Successful")

      }).catch((error) => {
        this.spinner.hide();
        alert("User denied transaction ")
        throw new Error(error);
      });
  }

  withdraw() { }








}
