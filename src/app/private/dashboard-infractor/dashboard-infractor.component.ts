import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {  Router } from '@angular/router';
import { ScheduleConfirmationDialogComponent } from 'src/app/shared/dialogs/schedule-confirmation-dialog/schedule-confirmation-dialog.component';
import { IDatosInfractor } from 'src/app/_models/datosinfractor.interface';
import { IInfraccion } from 'src/app/_models/infraccion.interface';
import { IInfractor } from 'src/app/_models/infractor.interface';
import { InfraccionService } from '../http/infraccion.service';
import { DataDatosInfractorService } from '../services/data-datos-infractor.service';
 
import { ISala } from 'src/app/_models/sala.interface';
import { AsistenciaService } from '../http/asistencia.service';
import { IAsistencia } from 'src/app/_models/asistencia.interface';
import { SalaService } from '../http/sala.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as html2pdf from 'html2pdf.js'
import { Clipboard } from '@angular/cdk/clipboard';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

export interface infraccionGrid{
  date:string;
  concept:string;
}

@Component({
  selector: 'app-dashboard-infractor',
  templateUrl: './dashboard-infractor.component.html',
  styleUrls: ['./dashboard-infractor.component.scss']
})
export class DashboardInfractorComponent implements OnInit {
  datosInfractor!: IDatosInfractor;
  infractor!: IInfractor;
  infracciones!: IInfraccion[];
  dataSource! :MatTableDataSource<infraccionGrid> ;
  displayedColumns: string[] = ['date', 'concept'];
  selectedSala!:ISala;
  asistencia:IAsistencia|undefined;
  
  isPrintingPdf : boolean = false;

  @ViewChild('infractorContent') infractorContent! : ElementRef

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private infraccionService: InfraccionService,
    private dataDatosInfractorSvc: DataDatosInfractorService,
    private asistenciaSvc:AsistenciaService,
    private salaSvc:SalaService,
    private snackBar:MatSnackBar,
    private clipboard:Clipboard,
    private spinnerService:SpinnerService
  ) { 

  }

  ngOnInit() {
    this.datosInfractor = this.dataDatosInfractorSvc.datosInfractor;
    this.infractor = this.dataDatosInfractorSvc.infractor;
    if (this.datosInfractor === null || this.datosInfractor === undefined ||
      this.infractor === null || this.infractor === undefined) {
      this.router.navigateByUrl("/login/infractor");
    }
    else{
      this.loadInfracciones(this.infractor.id);
      this.loadAsistencia();
    }
  }

  loadAsistencia():void{
    this.asistenciaSvc.getAsistenciaByInfractor(this.infractor.id).subscribe({
      next:(data:IAsistencia)=>{
        if(data!=undefined && data!=null){
          this.asistencia=data;
          this.loadSala();
        }
      },
      error:(err:any)=>{}
    });
  }

  loadInfracciones(infractorId: string): void {
    this.infraccionService.getInfracciones(infractorId).subscribe({
      next: (data: IInfraccion[]) => {
        this.infracciones = data;
        let dataGrid = this.infracciones.map(function(obj){
          return  {date:obj.fecha.toString() ,concept:obj.numeroInfraccion} 
        });
        this.dataSource= new MatTableDataSource<infraccionGrid>(dataGrid);
      },
      error: (err: any) => { }
    });
  }

  loadSala():void{
    this.salaSvc.getSalaByIdDeep(this.asistencia?.salaId!).subscribe({
      next:(data:ISala)=>{
        this.selectedSala=data;
      },
      error:(err:any)=>{}
    });
  }

  onChangeSelectedSala(event : any){
    this.selectedSala=event;
  }

  onSchedule():void{
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data=this.selectedSala;
    const dialog = this.matDialog.open(ScheduleConfirmationDialogComponent, dialogConfig);
    const sub = dialog.componentInstance.onSchedule.subscribe((data)=>{
      if(data){
        let newAsistencia:IAsistencia={
          asistio:false,
          id:0,
          infractorId:this.infractor.id,
          salaId:this.selectedSala.id
        }
        this.asistenciaSvc.saveAsistencia(newAsistencia).subscribe({
          next:(data:IAsistencia)=>{
            this.asistencia=data;
            this.loadSala();
          },
          error:(err:any)=>{
           this.snackBar.open('Ocurrio un error programando su curso , comuniquese con el administrador o intente mas tarde.', undefined, {
            panelClass: ['failure']
          });
          }
        });
      }
    });
    dialog.afterClosed().subscribe(()=>{
      sub.unsubscribe();
    });
  }

  printPdf(){
    const opt = {
      margin: 1,
      filename: "agenda.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    this.isPrintingPdf = true;
    try {
      this.spinnerService.show();
      setTimeout(async () => 
      {
        await html2pdf().set(opt).from(this.infractorContent.nativeElement.innerHTML).save();
        this.isPrintingPdf = false;
        this.spinnerService.hide();
      }, 500);
    } catch (error) {
      this.spinnerService.hide();
      this.snackBar.open("Ocurrion un error descargando el pdf.", undefined, {
        panelClass: ['failure']
      })
    }

  }

  copyClipBoard(){
    this.clipboard.copy(this.selectedSala.link);
  }
}
