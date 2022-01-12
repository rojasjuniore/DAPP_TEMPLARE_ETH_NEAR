import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3UtilsPipe } from './web3-utils.pipe';



@NgModule({
  declarations: [
    Web3UtilsPipe
  ],
  exports: [
    Web3UtilsPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
