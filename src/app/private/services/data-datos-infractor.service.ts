import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IInfractor } from 'src/app/_models/infractor.interface';

const initInfractor: IInfractor = {
  apellido: '',
  id: '',
  nombre: ''
}

@Injectable({
  providedIn: 'root'
})
export class DataDatosInfractorService {
  constructor() { }

  private infractor!: IInfractor;

  get getInfractor(): IInfractor {
    return this.infractor;
  }

  setInfractor(infractor: IInfractor): void {
    this.infractor = infractor;
  }

  //Observable
  // private infractor$ = new BehaviorSubject<IInfractor>(initInfractor);

  // get getInfractor(): Observable<IInfractor> {
  //   return this.infractor$.asObservable();
  // }

  // setInfractor(infractor:IInfractor):void{
  //   this.infractor$.next(infractor);
  //  }


}
