import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { fromWei, toWei } from 'src/app/helpers/utils';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-withdraw-token-onwer',
  templateUrl: './withdraw-token-onwer.component.html',
  styleUrls: ['./withdraw-token-onwer.component.css']
})
export class WithdrawTokenOnwerComponent implements OnInit {

  public form: FormGroup;
  submitted = false;

  public pair: any = null;
  public pairList: any[] = [];

  public dataStatus$!: Observable<any>;

  private sub$!: Subscription;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService,
    public sweetalert2Service: Sweetalert2Service,
    private spinner: NgxSpinnerService,
  ) {
    this.contractService.connectAccount();

    this.form = fb.group({
      value: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // this.loadPairList();

    // this.sub$ = this.contractService.dataStatus$
    //   .subscribe((dataStatus) => {

    //     if(!dataStatus){
    //       this.pairList = [];
    //     }else{
    //       this.loadPairs();
    //     }
    //   });
  }

  async loadPairs(){
    const pairList: any = await this.contractService.pairList();
    const toFormat: any[] = [];

    console.log({pairList});

    for (const [idx, entry] of Object.entries(pairList)) {
      const row: any = entry;
      if(row[11]){
        toFormat.push( this.contractService.getTokenName(row, idx) );
      }
    }

    const result = await Promise.all( toFormat );
    // console.log({result});
    this.pairList = result.filter((row) => !row.isNative)
  }

  async selectPair(item){
    this.pair = item;
  }

  removePair(){ this.pair = null; }

  // @dev - Set a new Buy limit
  async withdrawTokenOnwer() {
    
    if(this.form.invalid){ return; }
    
    if(!this.pair){ return; }
    
    this.submitted = true;

    const _data = this.form.value;
    console.warn("_data", _data)

    try {
      console.log(this.pair);
      const amount = toWei(_data.value, this.pair.tokenA.decimal);

      const withdraw = await this.contractService.withdrawTokenOnwer(this.pair.tokenA.contract, amount);

      return this.sweetalert2Service.showSuccess('Transacción exitosa');
    } catch (err) {
      console.log('Error on WithdrawTokenOnwerComponent@withdrawTokenOnwer', err);
    }
  }
}
