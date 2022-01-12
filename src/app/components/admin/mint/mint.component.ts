import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  public form: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService) {

    this.form = fb.group({
      account: [environment.contractAddress, Validators.required],
      stakeAmount: ["", Validators.required]
    });
  }

  ngOnInit(): void {



  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    console.log("data", data)

    // convientes las cantidades a ether
    // let amount = this.contractService.toWei(data.stakeAmount)


    // this.contractService._mint(data.account, amount)
    // this.form.reset();
    // this.submitted = false;
  }

}
