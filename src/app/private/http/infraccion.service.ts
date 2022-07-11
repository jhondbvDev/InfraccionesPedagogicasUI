import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInfraccion } from 'src/app/_models/infraccion.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfraccionService {

  constructor(private http:HttpClient) { }

  getInfracciones(infractorId:string):Observable<any>{
    return this.http.get<IInfraccion[]>(`${environment.API_URL}api/infracciones/getInfracciones/${infractorId}`)
  }

}
