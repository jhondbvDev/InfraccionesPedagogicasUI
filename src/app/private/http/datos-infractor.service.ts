import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectUnsubscribedError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDatosInfractor } from 'src/app/_models/datosinfractor.interface';

@Injectable({
  providedIn: 'root'
})
export class DatosInfractorService {

  constructor(private http: HttpClient) { }

  getDatosInfractor(id:string):Observable<any>{
    return this.http.get<IDatosInfractor>(`${environment.API_URL}api/datosinfractor/getDatosInfractor/${id}`);
  }

  saveDatosInfractor(datos:IDatosInfractor):Observable<any>{
    return this.http.post(`${environment.API_URL}api/datosinfractor`,datos);
  }

  updateDatosInfractor(datos:IDatosInfractor):Observable<any>{
    return this.http.put(`${environment.API_URL}api/datosinfractor`,datos);
  }
}
