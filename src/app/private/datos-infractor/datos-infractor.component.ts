import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/public/http/auth.service';
import { IDatosInfractor } from 'src/app/_models/datosinfractor.interface';
import { IInfractor } from 'src/app/_models/infractor.interface';
import { DatosInfractorService } from '../http/datos-infractor.service';
import { DataDatosInfractorService } from '../services/data-datos-infractor.service';

@Component({
  selector: 'app-datos-infractor',
  templateUrl: './datos-infractor.component.html',
  styleUrls: ['./datos-infractor.component.scss']
})
export class DatosInfractorComponent implements OnInit {

  private isValidEmail = /\S+@\S+\.\S+/;
  private isValidNumber=/^-?(0|[1-9]\d*)?$/;
  private isEditMode:boolean=false;
  infractor!: IInfractor;
  formDatosInfractor = new FormGroup({
    telefono: new FormControl('',[Validators.pattern(this.isValidNumber), Validators.maxLength(12)]),
    celular: new FormControl('', [Validators.required,Validators.pattern(this.isValidNumber), Validators.minLength(10), Validators.maxLength(12)]),
    direccion: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required, Validators.pattern(this.isValidEmail)])

  })
  constructor(
    private router: Router,
    private datosInfractorSvc: DatosInfractorService,
    private authService: AuthService,
    private dataInfractorService: DataDatosInfractorService) {

  }

  ngOnInit() {
    this.infractor = this.dataInfractorService.infractor;
    if (this.infractor === null || this.infractor === undefined) {
      console.log("Internal error ");
      this.cancel();
      return;
    }

    this.datosInfractorSvc.getDatosInfractor(this.infractor.id).subscribe({
      next: (data: IDatosInfractor) => {
        if (data !== null || data !== undefined) {
          this.isEditMode=true;
          this.formDatosInfractor.setValue({
            celular:data.celular,
            direccion:data.direccion,
            email:data.email,
            telefono:data.telefono
          });
        }
        else {
          this.isEditMode=false;
          //mostrar mensaje por favor ingrese sus datos
        }

      },
      error: (err: any) => {
        console.log(err.errorMessage);
      }
    });

  }

  confirmData() {
    if(!this.formDatosInfractor.valid){
      console.log("invalid");
      return;
      //TODO: mensaje , debe completar los campos 
    }
    let datosInfractor = this.formDatosInfractor.value as IDatosInfractor;
    datosInfractor.infractorId = this.infractor.id;
    if(this.isEditMode)
    {
      this.datosInfractorSvc.updateDatosInfractor(this.formDatosInfractor.value as IDatosInfractor).subscribe({
        next: () => { 
          this.dataInfractorService.setDatosInfractor(this.formDatosInfractor.value as IDatosInfractor)
          this.router.navigateByUrl("infractor/dashboard");
         },
        error: (err: any) => {
          console.log(err);
        }
      })
    }
    else{
      this.datosInfractorSvc.saveDatosInfractor(this.formDatosInfractor.value as IDatosInfractor).subscribe({
        next: () => { 
          this.dataInfractorService.setDatosInfractor(this.formDatosInfractor.value as IDatosInfractor)
          this.router.navigateByUrl("infractor/dashboard"); 
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    }
  }

  cancel() {
    this.authService.logout();
    this.router.navigateByUrl("infractor/login");
  }
}
