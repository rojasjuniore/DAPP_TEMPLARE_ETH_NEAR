import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-token-per-eth',
  templateUrl: './change-token-per-eth.component.html',
  styleUrls: ['./change-token-per-eth.component.scss']
})
export class ChangeTokenPerEthComponent implements OnInit {
  @Input() data: any
  public form: FormGroup;
  submitted = false;
  tokensPerEth: any;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService) {
    this.form = fb.group({
      amount: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("data", this.data)
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

    this.contractService.changeTokenPerEth(data.amount)
    this.form.reset();
    this.submitted = false;


  }


}
