import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ContractService } from 'src/app/services/contract.service';
import { ContractNearService } from 'src/app/services/contract-near.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
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
  public accountBSC: any;
  public accountNEAR: any;

  private code: any;

  private sub1$!: Subscription;
  private sub2$!: Subscription;

  constructor(
    private _location: Location,
    private contractSrv: ContractService,
    private contractNearSrv: ContractNearService,
    private route: ActivatedRoute,
    private apiSrv: ApiService,
  ) {
    this.code = this.apiSrv.userCode;
  }


  ngOnInit(): void {
    console.log('code', this.code);
    this.sub1$ = this.contractSrv.accountStatus$.subscribe(res => {
      if(res){ this.setSuccessWalletBSC(res.accountId); }
      
    })

    this.sub2$ = this.contractNearSrv.dataStatusNear$.subscribe(res => {
      if(res){ this.setSuccessWalletNEAR(res.accountId); }
    })
  }


  /**
   * Seteo de wallet de BSC
   * @param account 
   */
  setSuccessWalletBSC(account: string) {
    // console.log('bsc', account);
    this.accountBSC = account;
    this.inputWalletBSC.nativeElement.value = account;
    this.successWalletBSC = true;
  }


  /**
   * Seteo de wallet NEAR
   * @param account 
   */
  setSuccessWalletNEAR(account: string) {
    // console.log('near', account);
    this.accountNEAR = account;
    this.inputWalleNEAR.nativeElement.value = account;
    this.successWalletNEAR = true;
  }


  /**
   * Conectar wallet BSC
   */
  async connectAccountBSC() {
    // console.log("connectAccount BSC");
    this.contractSrv.connectAccount();
  }


  /**
   * Conectar wallet NEAR
   */
  async connectAccountNear() {
    // console.log("connectAccount NEAR");
    await this.contractNearSrv.initContract();
  }


  /**
   * Registrar usuario en la whitelist
   * TODO: Realizar validación y captura de errores
   */
  async registreOnWhitelist(){
    try {
      await this.apiSrv.registreOnWhitelist({
        code: this.code,
        walletbsc: this.accountBSC,
        walletnear: this.accountNEAR
      });
    } catch (err) {
      console.log('Error on WhitelistComponent@registreOnWhitelist', err);
    }
  }


  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.sub1$.unsubscribe();
    this.sub2$.unsubscribe();
  }
}
