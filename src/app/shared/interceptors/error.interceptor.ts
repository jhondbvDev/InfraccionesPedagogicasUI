import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/public/services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router,
    private storageService:StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err)=>{
       
        if([403,404].indexOf(err.status)!==-1)
        {
          
        }
        else if(err.status===0){
          err.error='Sistema fuera de servicio , intente mas tarde.';
        }
        else if(err.status===401){
          this.storageService.clearData();
          this.router.navigateByUrl("notfound404");
        }
        return throwError(()=>err);
      })
    );
  }

}

export const errorInterceptorProvider=[{provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true}];
