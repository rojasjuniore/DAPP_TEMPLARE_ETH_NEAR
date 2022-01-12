import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {

  public form: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService) {
    this.form = fb.group({
      amount: [0, Validators.required]
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
    // console.log("data.amount", data.amount)
    // let amount = this.contractService.toWei(data.amount)
    // console.log("amount", amount)
    // this.contractService.approve(amount)

    this.form.reset();
    this.submitted = false;
  }

}
