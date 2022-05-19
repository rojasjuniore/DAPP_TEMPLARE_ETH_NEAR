import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
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
    const _data = this.form.value;
    console.warn("_data", _data.address)

    if (this.form.invalid) {
      return;
    }
    
    this.submitted = true;
    try {
      const result = await this.contractService.addUser(_data.address);
      return this.sweetalert2Service.showSuccess('Transacción exitosa', 0);
    } catch (err) {
      console.log('Error on AddUserComponent@addUser', err);
    }
  }
}
