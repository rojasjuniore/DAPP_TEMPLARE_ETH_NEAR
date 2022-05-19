import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { toBasicPoint, toWei } from 'src/app/helpers/utils';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-factory-swap',
  templateUrl: './factory-swap.component.html',
  styleUrls: ['./factory-swap.component.css']
})
export class FactorySwapComponent implements OnInit {

  public toUpdate: any;

  public form: FormGroup;
  submitted = false;
  accountStatus: any;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService,
    private spinner: NgxSpinnerService,
  ) {
    this.form = fb.group({
      price: [0.026, Validators.required],
      tokenA: ["0x9236227D9cde82844a85AaEB1464451AeE073723", Validators.required],
      decimalTokenA: [6, Validators.required],
      tokenB: ["0x62cFc2220E40B5f35BccD34f19c1E7B663249DE3", Validators.required],
      decimalTokenB: [18, Validators.required],
      amountForTokens: [3, Validators.required],
      fee: [1, Validators.required],
      activeOracle: [false, Validators.required],
      addressOracle: ["0x92C09849638959196E976289418e5973CC96d645", Validators.required],
      addressDecimalOracle: [10, Validators.required],
      active: [true, Validators.required],
      isNative: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.contractService.connectAccount();
    
    this.contractService.dataStatus$.subscribe(res => {
      console.log("res", res)
      if (!res) { return }
      this.accountStatus = res;
      console.log(1, res.pairList)
    })
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;

    const data = this.form.value;
    console.log("data", data)
    console.log("this.form.invalid", this.form.invalid)

    if (this.form.invalid) {
      return;
    }

    const registerPairData = {
      "isNative": data.isNative,
      "price": toWei(`${data.price}`.replace(',', '.'), 18),
      "tokenA": data.tokenA,
      "decimalTokenA": `${data.decimalTokenA}`.toString(),
      "tokenB": data.tokenB,
      "decimalTokenB": `${data.decimalTokenB}`.toString(),
      "amountForTokens": `${data.amountForTokens}`.toString(),
      "fee": toBasicPoint(data.fee),
      "activeOracle": data.activeOracle,
      "addressOracle": data.addressOracle,
      "addressDecimalOracle": `${data.addressDecimalOracle}`.toString(),
      "active": data.active,
    }


    // this.factoryService.registerPair(registerPairData)
    // this.form.reset();
    this.submitted = false;

    return this.savePair(registerPairData);
  }

  updatePair(item: any){  this.toUpdate = item; }

  async savePair(pair: any){
    try {
      await this.spinner.show();
      await this.contractService.registerPair(Object.values(pair));
    } catch (err) {
      console.log('Error on FactorySwapComponent', err);
    }finally{
      this.spinner.hide();
    }
  }
}
