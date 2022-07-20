import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEditSala, INewSala, ISala } from 'src/app/_models/sala.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  constructor(private http:HttpClient) { }

  getSalas():Observable<any>{
    return this.http.get<ISala[]>(`${environment.API_URL}api/sala/deep`)
  }

  getSalasWithPagination(currentPage: number, pageSize: number):Observable<any>{
    return this.http.get<ISala[]>(`${environment.API_URL}api/sala/deep/pagination?PageNumber=${currentPage}&PageSize=${pageSize}`)
  }

  getSalasCount():Observable<any>{
    return this.http.get<number>(`${environment.API_URL}api/sala/deep/count`)
  }

  getSalasForUser(userId : string, currentPage: number, pageSize: number):Observable<any>{
    return this.http.get<ISala[]>(`${environment.API_URL}api/sala/deep/user/${userId}?PageNumber=${currentPage}&PageSize=${pageSize}`)
  }

  getSalaById(id:number):Observable<any>{
    return this.http.get<ISala>(`${environment.API_URL}api/sala/${id}`)
  }

  getSalaByIdDeep(id:number):Observable<any>{
    return this.http.get<ISala>(`${environment.API_URL}api/sala/deep/${id}`)
  }

  getSalasCountForUser(userId : string):Observable<any>{
    return this.http.get<number>(`${environment.API_URL}api/sala/deep/user/count/${userId}`)
  }

  createSala(sala : INewSala):Observable<any>{
    return this.http.post(`${environment.API_URL}api/sala`, sala, { responseType: 'text' })
  }

  updateSala(sala : IEditSala):Observable<any>{
    return this.http.put(`${environment.API_URL}api/sala`, sala, { responseType: 'text' })
  }

  deleteSala(salaId : number):Observable<any>{
    return this.http.delete<boolean>(`${environment.API_URL}api/sala/${salaId}`)
  }
}
