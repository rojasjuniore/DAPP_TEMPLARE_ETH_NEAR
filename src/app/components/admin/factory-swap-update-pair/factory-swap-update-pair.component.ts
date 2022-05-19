import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { toBasicPoint, toWei } from 'src/app/helpers/utils';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-factory-swap-update-pair',
  templateUrl: './factory-swap-update-pair.component.html',
  styleUrls: ['./factory-swap-update-pair.component.css']
})
export class FactorySwapUpdatePairComponent implements OnInit, OnChanges {

  @Input() pair: any;

  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contractSrv: ContractService,
    private spinner: NgxSpinnerService,
    private sweetAlertSrv: Sweetalert2Service,
  ) { }

  ngOnInit(): void {
    console.log('pair', this.pair);
    this.buildForm();
  }

  buildForm(){
    this.form = this.fb.group({
      price: [this.pair?.price, [Validators.required]],
      tokenA: [this.pair?.tokenA.contract, [Validators.required]],
      decimalTokenA: [this.pair?.tokenA.decimal, [Validators.required]],
      tokenB: [this.pair?.tokenB.contract, [Validators.required]],
      decimalTokenB: [this.pair?.tokenB.decimal, [Validators.required]],
      amountForTokens: [this.pair?.amountForTokens, [Validators.required]],
      fee: [this.pair?.fee, [Validators.required]],
      activeOracle: [this.pair?.activeOracle, [Validators.required]],
      addressOracle: [this.pair?.addressOracle, [Validators.required]],
      addressDecimalOracle: [this.pair?.addressDecimalOracle, [Validators.required]],
      isNative: [this.pair?.isNative, [Validators.required]],
    });
  }

  get f(){ return this.form.controls; }

  fieldHasError(field: string){
    // return (!this.f[field]['errors'])
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pair } = changes;
    console.log(changes);
    this.pair = pair.currentValue;
    this.buildForm();
  }

  async updatePair(field: string){
    try {
      const toUpdate = {
        type: 0,
        decimal: 0,
        id: this.pair?.pairId,
        bool: false,
        address: '0x000000000000000000000000000000000000dead',
        value: 0,
      };

      switch (field) {
        case 'price':
          toUpdate.value = toWei(this.f.price.value, 18);
          toUpdate.type = 1;
          break;

        case 'tokenA':
          toUpdate.address = this.f.tokenA.value;
          toUpdate.type = 2;
          break;

        case 'decimalTokenA':
          toUpdate.decimal = this.f.decimalTokenA.value;
          toUpdate.type = 3;
          break;

        case 'tokenB':
          toUpdate.address = this.f.tokenB.value;
          toUpdate.type = 4;
          break;

        case 'decimalTokenB':
          toUpdate.decimal = this.f.decimalTokenB.value;
          toUpdate.type = 5;
          break;

        case 'amountForTokens':
          toUpdate.value = this.f.amountForTokens.value;
          toUpdate.type = 6;
          break;

        case 'fee':
          toUpdate.value = toBasicPoint(this.f.fee.value);
          toUpdate.type = 7;
          break;

        case 'activeOracle':
          toUpdate.bool = this.f.activeOracle.value;
          toUpdate.type = 8;
          break;

        case 'addressOracle':
          toUpdate.address = this.f.addressOracle.value;
          toUpdate.type = 9;
          break;

        case 'addressDecimalOracle':
          toUpdate.decimal = this.f.addressDecimalOracle.value;
          toUpdate.type = 10;
          break;

        case 'isNative':
          toUpdate.bool = this.f.isNative.value;
          toUpdate.type = 11;
          break;
      
        default:
          console.log('Not handler');
          return;
      }

      await this.spinner.show();

      await this.contractSrv.pairChange( Object.values(toUpdate) );

      return this.sweetAlertSrv.showSuccess('Transacción exitosa');
    } catch (err) {
      console.log('Error on FactorySwapUpdatePairComponent@updatePair', err);
    }finally{
      this.spinner.hide();
    }
  }

}
