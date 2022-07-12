import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const INFRACTOR_KEY ='auth-infractor'
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  clearData(): void {
    
    localStorage.clear();
  }

  saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem(USER_KEY) as any);
  }

  


}
