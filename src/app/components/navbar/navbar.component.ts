import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  accountStatus: any;

  constructor(public contractService: ContractService) { }

  ngOnInit(): void {

    this.contractService.dataStatusSource.subscribe(res => {
      this.accountStatus = res;
      // console.log("this.accountStatus ", this.accountStatus )
    })


    // let oldData = this.contractService.getDataContract()
    // this.accountStatus = this.getAddress(oldData.accounts);
    // this.contractService.dataStatusSource.subscribe(res => {
    //   if (!res || res == "") { return }
    //   this.accountStatus = this.getAddress(res.accounts);
    // })
  }



  getAddress(address: string) {
    if (!address) { return }
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)

  }

  connectAccount() {
    console.log("connectAccount")
    this.contractService.connectAccount();
  }

  logout() {
    this.contractService.logout();
  }

}
