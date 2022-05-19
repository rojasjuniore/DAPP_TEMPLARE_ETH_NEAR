// https://medium.com/upstate-interactive/how-to-connect-an-angular-application-to-a-smart-contract-using-web3js-f83689fb6909

import { Component, OnInit } from '@angular/core';
import { ContractNearService } from 'src/app/services/contract-near.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accountStatus: any;
  accountNear: any;
  accountEth: any;
  constructor(public contractService: ContractService,
    public contractNearService: ContractNearService) { }

  ngOnInit(): void {
    this.contractService.accountStatus$.subscribe(res => {
      this.accountEth = res.accountId
    })

    this.contractNearService.dataStatusNear$.subscribe(res => {
      this.accountNear = res.accountId
    })
  }

  connectAccount() {
    console.log("connectAccount")
    this.contractService.connectAccount();
  }

  connectAccountNear() {
    console.log("connectAccount")
    this.contractNearService.initContract();
  }

  logout() {
    console.log("logout")
    this.contractService.logout();
  }


}
