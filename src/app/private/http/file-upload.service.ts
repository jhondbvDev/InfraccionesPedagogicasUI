import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http:HttpClient) { }

  processInfracciones(file : File): Observable<any>{

    let formData = new FormData();
    formData.append("file", file, file.name);

    return this.http.post(`${environment.API_URL}api/FileUpload`, formData);
  }
}
