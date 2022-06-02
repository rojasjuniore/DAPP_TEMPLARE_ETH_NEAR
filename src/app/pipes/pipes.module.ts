import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncateWalletAddressPipe } from './truncate-wallet-address.pipe';



@NgModule({
  declarations: [
    TruncateWalletAddressPipe,
  ],
  exports: [
    TruncateWalletAddressPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
