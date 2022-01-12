import { Component, Input, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-pausable',
  templateUrl: './pausable.component.html',
  styleUrls: ['./pausable.component.scss']
})
export class PausableComponent implements OnInit {
  @Input() status

  constructor(public contractService: ContractService) { }

  ngOnInit(): void {
  }


  pause() {
    //  this.contractService.pause();
  }


  Unpause() {
    //  this.contractService.Unpause();
  }

}
