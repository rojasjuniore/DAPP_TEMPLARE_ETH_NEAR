import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-change-pre-sale-commission',
  templateUrl: './change-pre-sale-commission.component.html',
  styleUrls: ['./change-pre-sale-commission.component.scss']
})
export class ChangePreSaleCommissionComponent implements OnInit {
  public form: FormGroup;
  submitted = false;
  data: any;
  tokensPerEth: any;
  getPreSaleCommission: any;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService) {
    this.form = fb.group({
      amount: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.contractService.dataStatus$.subscribe(res => {
      this.data = res
      this.getPreSaleCommission = this.data.getPreSaleCommission

    })
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

    this.contractService.changePreSaleCommission(data.amount)
    this.form.reset();
    this.submitted = false;


  }

}
