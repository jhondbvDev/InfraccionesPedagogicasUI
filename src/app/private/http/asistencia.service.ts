import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IAsistencia, IAsistenciaDeep, IUpdateAsistencia } from 'src/app/_models/asistencia.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http:HttpClient) { }

  getAsistenciaByInfractor(id:string):Observable<any>{
    return this.http.get<IAsistencia>(`${environment.API_URL}api/asistencia/getAsistenciaByInfractor/${id}`);
  }

  getAsistenciaBySala(idSala:number):Observable<any>{
    return this.http.get<IAsistenciaDeep[]>(`${environment.API_URL}api/asistencia/getAsistenciasBySala/${idSala}`)
  }

  saveAsistencia(asistencia:IAsistencia):Observable<any>{
    return this.http.post(`${environment.API_URL}api/asistencia/`,asistencia);
  }

  updateAsitencia(asistencia : IUpdateAsistencia):Observable<any>{
    return this.http.put(`${environment.API_URL}api/asistencia/`,asistencia, { responseType: 'text' });
  }
}
