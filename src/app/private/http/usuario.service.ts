import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INewUserInfo, IUserInfo } from 'src/app/_models/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  registerUser(usuario : INewUserInfo): Observable<any>{
    return this.http.post(`${environment.API_URL}api/Usuario`, usuario, { responseType: 'text' });
  }

  getUsers(userId : string, currentPage: number, pageSize: number):Observable<any>{
    return this.http.get<IUserInfo[]>(`${environment.API_URL}api/Usuario/${userId}?PageNumber=${currentPage}&PageSize=${pageSize}`)
  }

  getUsersCount(userId : string):Observable<any>{
    return this.http.get<IUserInfo[]>(`${environment.API_URL}api/Usuario/Count/${userId}`)
  }

  deleteUser(userId : string): Observable<any>{
    return this.http.delete(`${environment.API_URL}api/Usuario/${userId}`,{ responseType: 'text' });
  }
}
