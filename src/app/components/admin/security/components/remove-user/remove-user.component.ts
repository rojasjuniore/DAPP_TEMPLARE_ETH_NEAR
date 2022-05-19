import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrls: ['./remove-user.component.css']
})
export class RemoveUserComponent implements OnInit {

  public form: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService,
    public sweetalert2Service: Sweetalert2Service,
  ) { 
    this.form = fb.group({
      address: ["", Validators.required],
    });
  }

  ngOnInit(): void { }

  
  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    const _data = this.form.value;

    try {
      const result = await this.contractService.removeUser(_data.address);
      return this.sweetalert2Service.showSuccess('Transacción exitosa', 0);
    } catch (err) {
      console.log('Error on RemoveUserComponent@removeUser', err);
    }
  }
}
