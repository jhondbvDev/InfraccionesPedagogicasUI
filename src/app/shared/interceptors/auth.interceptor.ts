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
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router:Router,
    private storageService:StorageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.storageService.getToken();
    if(token!==undefined && token!==null){
      request = request.clone({
        headers:request.headers.set('Authorization',`Bearer ${token}`)
    })
    }

    return next.handle(request);
  }
}
export const authInterceptorProvider=[
  {
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
  }
  ];
