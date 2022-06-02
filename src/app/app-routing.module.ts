import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWalletComponent } from './components/create-wallet/create-wallet.component';
import { MainComponent } from './components/main/main.component';
import { WhitelistComponent } from './components/whitelist/whitelist.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'white-list', component: WhitelistComponent },
  { path: 'create-wallet', component: CreateWalletComponent },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

