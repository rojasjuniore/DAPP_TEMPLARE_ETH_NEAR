import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// import { AdminService } from 'src/app/services/admin.service';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-set-value-address',
  templateUrl: './set-value-address.component.html',
  styleUrls: ['./set-value-address.component.css']
})
export class SetValueAddressComponent implements OnInit {

  public form: FormGroup;
  submitted = false;
  public dataStatus$!: Observable<any>;


  constructor(
    public fb: FormBuilder,
    public contractService: ContractService,
    public sweetalert2Service: Sweetalert2Service,
  ) {
    this.form = fb.group({
      value: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.dataStatus$ = this.contractService.dataStatus$;
  }
  // @dev - Set address oraculo native
  async setVaultAddress() {
    this.submitted = true;
    const _data = this.form.value;
    console.warn("_data", _data.value)

    if (this.form.invalid) {
      return;
    }

    try {
      const result = await this.contractService.setVaultAddress(_data.value);
      return this.sweetalert2Service.showSuccess('Transacción exitosa');
      
    } catch (err) {
      console.log('Error on SellLimitComponent@setSellLimit', err);
    }
  }

}
