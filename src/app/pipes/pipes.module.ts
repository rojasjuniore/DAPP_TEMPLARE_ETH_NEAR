import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3UtilsPipe } from './web3-utils.pipe';
import { TruncateWalletAddressPipe } from './truncate-wallet-address.pipe';
import { PairPipe } from './pair.pipe';



@NgModule({
  declarations: [
    Web3UtilsPipe,
    TruncateWalletAddressPipe,
    PairPipe,
  ],
  exports: [
    Web3UtilsPipe,
    TruncateWalletAddressPipe,
    PairPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
