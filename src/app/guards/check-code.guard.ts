import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CheckCodeGuard implements CanActivate {

  constructor(
    private apiSrv: ApiService,
    private router: Router,
  ){ }

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const userCode = this.apiSrv.userCode;

    if(!userCode){
      return this.router.navigate([`/`]);
    }

    return true;
  }
  
}
