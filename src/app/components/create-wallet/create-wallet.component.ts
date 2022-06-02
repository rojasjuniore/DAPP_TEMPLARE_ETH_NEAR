import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss'],
})
export class CreateWalletComponent implements OnInit {
  count = 1;
  maxCount = 4;

  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }

  next(): void {
    if (this.count < this.maxCount) {
      this.count++;
    }
  }

  last(): void {
    if (this.count > 1) {
      this.count--;
    }
  }

  ngOnInit(): void {}
}
