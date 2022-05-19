import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-withdraw-matic-owner',
  templateUrl: './withdraw-matic-owner.component.html',
  styleUrls: ['./withdraw-matic-owner.component.css']
})
export class WithdrawMaticOwnerComponent implements OnInit {

  public form: FormGroup;
  submitted = false;
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
  }

  // @dev - Set a new Buy limit
  async withdrawMaticOwner() {
    this.submitted = true;
    const _data = this.form.value;
    console.warn("_data", _data)

    if (this.form.invalid) {
      return;
    }

    try {
      const withdraw = await this.contractService.withdrawMaticOwner(_data.value);
    } catch (err) {
      console.log('Error on WithdrawMaticOwnerComponent@withdrawMaticOwner', err);
    }
    //  this.adminServices.withdrawMaticOwner(_data.value);
  }


}
