import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { toWei } from 'src/app/helpers/utils';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-sell-limit',
  templateUrl: './sell-limit.component.html',
  styleUrls: ['./sell-limit.component.css']
})
export class SellLimitComponent implements OnInit {
  public form: FormGroup;
  submitted = false;

  public dataStatus$!: Observable<any>;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService,
    public sweetalert2Service: Sweetalert2Service,
  ) {
    this.form = fb.group({
      value: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.dataStatus$ = this.contractService.dataStatus$;
  }

  // @dev - Set a new Sell limit
  async setSellLimit() {
    this.submitted = true;
    const _data = this.form.value;
    console.warn("_data", _data)

    if (this.form.invalid) {
      return;
    }

    try {
      const result = await this.contractService.setSellLimit( toWei(_data.value, 18) );
      return this.sweetalert2Service.showSuccess('Transacción exitosa');
      
    } catch (err) {
      console.log('Error on SellLimitComponent@setSellLimit', err);
    }
  }


}
