import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';

const routes: Routes = [
    {
        path: '',
        component: SecurityComponent,
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/admin/security',
    }, 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SecurityRoutingModule { }
