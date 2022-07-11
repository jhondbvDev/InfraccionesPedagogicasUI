import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInfractor } from 'src/app/_models/infractor.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginInfractorService {

  constructor(private http: HttpClient) { }

  getInfractor(id:string):Observable<any>{
    return this.http.get<IInfractor>(`${environment.API_URL}api/infractor/${id}`);
  }
  
} 
