import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3UtilsPipe } from './web3-utils.pipe';
import { TruncateWalletAddressPipe } from './truncate-wallet-address.pipe';



@NgModule({
  declarations: [
    Web3UtilsPipe,
    TruncateWalletAddressPipe,
  ],
  exports: [
    Web3UtilsPipe,
    TruncateWalletAddressPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
