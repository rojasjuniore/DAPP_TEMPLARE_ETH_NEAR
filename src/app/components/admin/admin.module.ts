import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { BuyLimitComponent } from './buy-limit/buy-limit.component';
import { SellLimitComponent } from './sell-limit/sell-limit.component';
import { SetValueAddressComponent } from './set-value-address/set-value-address.component';
import { FactorySwapComponent } from './factory-swap/factory-swap.component';
import { FactorySwapUpdatePairComponent } from './factory-swap-update-pair/factory-swap-update-pair.component';
import { WithdrawMaticOwnerComponent } from './withdraw-matic-owner/withdraw-matic-owner.component';
import { WithdrawTokenOnwerComponent } from './withdraw-token-onwer/withdraw-token-onwer.component';
import { TransferOwnershipComponent } from './transfer-ownership/transfer-ownership.component';
import { PausableComponent } from './pausable/pausable.component';
import { BurnComponent } from './burn/burn.component';
import { MintComponent } from './mint/mint.component';
import { BalanceOfContractEtherComponent } from './balance-of-contract-ether/balance-of-contract-ether.component';
import { SecurityModule } from './security/security.module';


@NgModule({
  declarations: [
    DashboardComponent,
    BuyLimitComponent,
    SellLimitComponent,
    SetValueAddressComponent,
    FactorySwapComponent,
    FactorySwapUpdatePairComponent,
    WithdrawMaticOwnerComponent,
    WithdrawTokenOnwerComponent,
    TransferOwnershipComponent,
    PausableComponent,
    BurnComponent,
    MintComponent,
    BalanceOfContractEtherComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    SecurityModule,
  ]
})
export class AdminModule { }
