import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityComponent } from './security.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SecurityRoutingModule } from './security-routing.module';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { RemoveAdminComponent } from './components/remove-admin/remove-admin.component';
import { RemoveUserComponent } from './components/remove-user/remove-user.component';
import { AppRoutingModule } from 'src/app/app-routing.module';


@NgModule({
  declarations: [
    SecurityComponent,
    AddUserComponent,
    AddAdminComponent,
    RemoveAdminComponent,
    RemoveUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    PipesModule,
    SecurityRoutingModule
  ]
})
export class SecurityModule { }
