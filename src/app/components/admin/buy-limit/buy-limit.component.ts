import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { toWei } from 'src/app/helpers/utils';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-buy-limit',
  templateUrl: './buy-limit.component.html',
  styleUrls: ['./buy-limit.component.css']
})
export class BuyLimitComponent implements OnInit {
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

  // @dev - Set a new Buy limit
  async setBuyLimit() {
    this.submitted = true;
    const _data = this.form.value;
    console.warn("_data", _data)

    if (this.form.invalid) {
      return;
    }

    try {
      const result = await this.contractService.setBuyLimit( toWei(_data.value, 18) );
      return this.sweetalert2Service.showSuccess('Transacción exitosa');
      
    } catch (err) {
      console.log('Error on BuyLimitComponent@setBuyLimit', err);
    }
    //  this.adminServices.setBuyLimit(_data.value);
  }


}
