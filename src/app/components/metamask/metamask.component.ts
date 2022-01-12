import { Component, OnInit } from '@angular/core';
import { AddTokenAMetamaskService } from 'src/app/services/add-metamask.service';

@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.scss']
})
export class MetamaskComponent implements OnInit {

  constructor(public metamaskService: AddTokenAMetamaskService) { }

  ngOnInit(): void {
  }

  addToken() {
    alert('addToken')
    console.log('add Token MPLUS')
    this.metamaskService.addToken()
  }

  addEthereumChain() {
    alert('add red chain')
    console.log('add red chain')
    this.metamaskService.addEthereumChain()
  }

}
