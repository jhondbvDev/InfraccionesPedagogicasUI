import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/public/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private storageSvc: StorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let user = this.storageSvc.getUser();
    if (this.storageSvc.getUser()) {
      if (user.rol?.toLowerCase() === route.url[0].path.toLowerCase()) {
        return true;
      }
      else {
        return this.goToLogin();
      }
    } else {
      return this.goToLogin();
    }
  }

  private goToLogin():boolean{
    this.router.navigateByUrl("/infractor/login");
    return false;
  }
}


