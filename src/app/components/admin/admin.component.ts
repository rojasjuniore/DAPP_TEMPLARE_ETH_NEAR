import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  data: any;

  constructor(public contractService: ContractService) { }

  ngOnInit(): void {
    this.contractService.reInitializating()
    this.contractService.dataStatus$.subscribe(res => {
      this.data = res
    })
  }

}
