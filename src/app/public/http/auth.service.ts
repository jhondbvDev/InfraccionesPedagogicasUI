import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../services/storage.service'
import { catchError } from 'rxjs/operators';
import { IToken } from 'src/app/_models/token.interface';
import { IUser, IUserInfo } from 'src/app/_models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private StorageService:StorageService) { }

  getAuth(authData: IUser): Observable<any> {
    return this.http.post<IToken>(`${environment.API_URL}api/auth/signIn`, authData)
      .pipe(
        catchError(err => this.handleError(err))
      )

  }

  setUserInfo(): void {
    let decodedJWT = this.getClaims();
    let userInfo= {id:decodedJWT.UserId,
      name:decodedJWT.name,
      email:decodedJWT.email,
    rol:decodedJWT.role}
    this.StorageService.saveUser(userInfo);
  }

  getCurrentUser(): IUserInfo {
    
     return this.StorageService.getUser();
  }

  isLoggedIn(): boolean {
    return this.StorageService.getToken()!=null;
  }

  logout(): void {
    this.StorageService.clearData();
  }


  private handleError(err: any): Observable<never> {
    let errorMessage = 'An error occured retrieving data ';
    if (err) {
      errorMessage = `Error : code ${err.message}`;

    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  private getClaims():any{
    let token = this.StorageService.getToken();
    let decodedJWT = JSON.parse(window.atob(token!.split('.')[1]));
    let str;
    const claims = {} as any;

    Object.entries(decodedJWT).forEach(
      ([key,value])=>{
        if(key.includes('/')){
          str = key.substring(key.lastIndexOf('/') + 1, key.length);
        }
        else
        {
          str=key;
        }
        claims[str]=value
      }
    )
    return claims;
  }
}

