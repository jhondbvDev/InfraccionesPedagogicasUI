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

  getSalasForUser(userId : string):Observable<any>{
    return this.http.get<ISala[]>(`${environment.API_URL}api/sala/deep/user/${userId}`)
  }

  getSalaById(id:number):Observable<any>{
    return this.http.get<ISala>(`${environment.API_URL}api/sala/${id}`)
  }

  getSalaByIdDeep(id:number):Observable<any>{
    return this.http.get<ISala>(`${environment.API_URL}api/sala/deep/${id}`)
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
