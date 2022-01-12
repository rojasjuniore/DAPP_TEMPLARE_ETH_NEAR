import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-burn',
  templateUrl: './burn.component.html',
  styleUrls: ['./burn.component.scss']
})
export class BurnComponent implements OnInit {

  public form: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService) {
    this.form = fb.group({
      account: [environment.contractAddress, Validators.required],
      amount: ["", Validators.required]
    });
  }

  ngOnInit(): void {
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



    // convientes las cantidades a ether
    // let amount = this.contractService.toWei(data.amount)


    // this.contractService.burn(data.account, amount)
    // this.form.reset();
    // this.submitted = false;


  }

}
