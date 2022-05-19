import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  accountStatus: any;
  account: any;


  constructor(
    public contractService: ContractService,
    public commonService: CommonService,
  ) {
    this.contractService.connectAccount()
    this.contractService.dataStatus$.subscribe(res => {
      if (!res) { return }
      this.accountStatus = res;
      this.account = this.accountStatus["accounts"]
    })
  }

  ngOnInit(): void {

  }

}
