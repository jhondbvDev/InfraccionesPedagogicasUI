import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDatosInfractor } from 'src/app/_models/datosinfractor.interface';
import { IInfractor } from 'src/app/_models/infractor.interface';

// const initInfractor: IInfractor = {
//   apellido: '',
//   id: '',
//   nombre: ''
// }

@Injectable({
  providedIn: 'root'
})
export class DataDatosInfractorService {
  constructor() { }

  private currentInfractor!: IInfractor;
  private currentDatosInfractor!:IDatosInfractor;

  get infractor(): IInfractor {
    return this.currentInfractor;
  }

  setInfractor(infractor: IInfractor): void {
    this.currentInfractor = infractor;
  }

  get datosInfractor(): IDatosInfractor {
    return this.currentDatosInfractor;
  }

  setDatosInfractor(datos: IDatosInfractor): void {
    this.currentDatosInfractor = datos;
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
