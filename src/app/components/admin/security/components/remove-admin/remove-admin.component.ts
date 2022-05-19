import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';

@Component({
  selector: 'app-remove-admin',
  templateUrl: './remove-admin.component.html',
  styleUrls: ['./remove-admin.component.css']
})
export class RemoveAdminComponent implements OnInit {

  constructor(
    public contractService: ContractService,
    public sweetalert2Service: Sweetalert2Service,
  ) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    const ask = await this.sweetalert2Service.askConfirm('Renounce admin role?');
    if(!ask){ return; }

    console.log('proceed');
    return;

    try {
      const result = await this.contractService.renounceAdmin();
      return this.sweetalert2Service.showSuccess('Transacción exitosa', 0);
    } catch (err) {
      console.log('Error on RemoveAdminComponent@removeUser', err);
    }
  }
}
