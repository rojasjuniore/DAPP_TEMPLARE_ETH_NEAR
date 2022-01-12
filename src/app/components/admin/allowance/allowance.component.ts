import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-allowance',
  templateUrl: './allowance.component.html',
  styleUrls: ['./allowance.component.scss']
})
export class AllowanceComponent implements OnInit {

  public form: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService) {
    this.form = fb.group({
      addressOwner: ["", Validators.required],
      addressSpender: ["", Validators.required]
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


    // let amount = this.contractService.toWei("20")
    // this.contractService._approve(amount)

    // this.form.reset();
    // this.submitted = false;
  }

}
