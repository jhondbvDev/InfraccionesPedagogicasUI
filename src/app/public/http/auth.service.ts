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
    console.log('HTTP request auth/login');
    return this.http.post<IToken>(`${environment.API_URL}/auth/login`, authData)
      .pipe(
        catchError(err => this.handleError(err))
      )

  }

  getUser(): Observable<any> {
    console.log('HTTP request auth/me');
    return this.http.get<IUserInfo>(`${environment.API_URL}/auth/me`)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  setUserInfo(): void {
    this.getUser().subscribe(
      d => {
        this.StorageService.saveUser(d);
      },
      err => {
      }
    );
  }

  getCurrentUser(): IUserInfo {
    return this.StorageService.getUser();
  }

  isLoggedIn(): boolean {
    if (this.StorageService.getToken() != null) {
      return true;
    }
    else { return false; }
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
}

