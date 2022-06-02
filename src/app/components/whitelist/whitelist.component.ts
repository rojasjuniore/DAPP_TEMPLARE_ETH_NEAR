import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ContractService } from 'src/app/services/contract.service';
import { ContractNearService } from 'src/app/services/contract-near.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss'],
})
export class WhitelistComponent implements OnInit, OnDestroy {

  @ViewChild('inputWalletBSC', {read: ElementRef}) inputWalletBSC!: ElementRef<HTMLInputElement>;
  @ViewChild('inputWalleNEAR', {read: ElementRef}) inputWalleNEAR!: ElementRef<HTMLInputElement>;

  public successWalletBSC = false;
  public successWalletNEAR = false;
  public accountEth: any;
  public accountNear: any;

  private sub1$!: Subscription;
  private sub2$!: Subscription;

  constructor(
    private _location: Location,
    private contractSrv: ContractService,
    private contractNearSrv: ContractNearService
  ) { }


  ngOnInit(): void {
    this.contractSrv.accountStatus$.subscribe(res => {
      if(res){ this.setSuccessWalletBSC(res.accountId); }
      
    })

    this.contractNearSrv.dataStatusNear$.subscribe(res => {
      if(res){ this.setSuccessWalletNEAR(res.accountId); }
    })
  }


  /**
   * Seteo de wallet de BSC
   * @param account 
   */
  setSuccessWalletBSC(account: string) {
    console.log('bsc', account);
    this.accountEth = account;
    this.inputWalletBSC.nativeElement.value = account;
    this.successWalletBSC = true;
  }


  /**
   * Seteo de wallet NEAR
   * @param account 
   */
  setSuccessWalletNEAR(account: string) {
    console.log('near', account);
    this.accountNear = account;
    this.inputWalleNEAR.nativeElement.value = account;
    this.successWalletNEAR = true;
  }


  /**
   * Conectar wallet BSC
   */
  async connectAccountBSC() {
    console.log("connectAccount BSC")
    this.contractSrv.connectAccount();
  }


  /**
   * Conectar wallet NEAR
   */
  async connectAccountNear() {
    console.log("connectAccount NEAR")
    await this.contractNearSrv.initContract();
  }

  async registreOnWhitelist(){
    console.log('try to submit');
  }


  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    if(this.sub1$){ this.sub1$.unsubscribe(); }
    if(this.sub2$){ this.sub2$.unsubscribe(); }
  }
}
