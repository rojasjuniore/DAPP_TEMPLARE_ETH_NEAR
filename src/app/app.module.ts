import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PipesModule } from './pipes/pipes.module';
// import { AdminComponent } from './components/admin/admin.component';
// import { AllowanceComponent } from './components/admin/allowance/allowance.component';
// import { ApproveComponent } from './components/admin/approve/approve.component';
// import { BalanceOfContractEtherComponent } from './components/admin/balance-of-contract-ether/balance-of-contract-ether.component';
// import { BurnComponent } from './components/admin/burn/burn.component';
// import { ChangePreSaleCommissionComponent } from './components/admin/change-pre-sale-commission/change-pre-sale-commission.component';
// import { ChangeTokenPerEthComponent } from './components/admin/change-token-per-eth/change-token-per-eth.component';
// import { MintComponent } from './components/admin/mint/mint.component';
// import { PausableComponent } from './components/admin/pausable/pausable.component';
// import { TransferOwnershipComponent } from './components/admin/transfer-ownership/transfer-ownership.component';
// import { MetamaskComponent } from './components/metamask/metamask.component';
// import { NavbarComponent } from './components/navbar/navbar.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdminModule } from './components/admin/admin.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    // HomeComponent,
    // NavbarComponent,
    // MetamaskComponent,
    // AdminComponent,
    // AllowanceComponent,
    // ApproveComponent,
    // BalanceOfContractEtherComponent,
    // BurnComponent,
    // ChangeTokenPerEthComponent,
    // MintComponent,
    // PausableComponent,
    // TransferOwnershipComponent,
    // ChangePreSaleCommissionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    AppRoutingModule,
    NgxSpinnerModule,
    PipesModule,
    AdminModule,
    NgxMaskModule.forRoot(maskConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
