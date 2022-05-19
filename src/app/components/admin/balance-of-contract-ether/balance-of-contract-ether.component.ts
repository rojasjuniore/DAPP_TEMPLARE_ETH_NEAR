import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-balance-of-contract-ether',
  templateUrl: './balance-of-contract-ether.component.html',
  styleUrls: ['./balance-of-contract-ether.component.scss']
})
export class BalanceOfContractEtherComponent implements OnInit {

  submitted = false;
  data: any;
  balanceOfContractEther: any;
  public nativeToken = environment.chain.nativeCurrency.symbol;

  constructor(
    public fb: FormBuilder,
    public contractService: ContractService) {
  }

  ngOnInit(): void {
    this.contractService.dataStatus$.subscribe(res => {
      this.data = res
      // console.log("this.data", this.data)
      this.balanceOfContractEther = this.data.myContractEther

    })
  }


  submit() {
    this.contractService.withdraw()
  }


}
