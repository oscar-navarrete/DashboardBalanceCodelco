import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'app/main/services/auth.service';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard implements CanLoad, CanActivate {

  constructor(private auth: AuthService, private route: Router) {

  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.validateToken();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.validateToken();
  }
  
}
