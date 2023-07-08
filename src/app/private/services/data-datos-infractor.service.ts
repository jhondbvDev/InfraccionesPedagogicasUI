import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDatosInfractor } from 'src/app/_models/datosinfractor.interface';
import { IInfractor } from 'src/app/_models/infractor.interface';


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


}
