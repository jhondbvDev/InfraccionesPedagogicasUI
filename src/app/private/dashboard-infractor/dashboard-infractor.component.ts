import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Data, Router, TitleStrategy } from '@angular/router';
import { ScheduleConfirmationDialogComponent } from 'src/app/shared/dialogs/schedule-confirmation-dialog/schedule-confirmation-dialog.component';
import { IDatosInfractor } from 'src/app/_models/datosinfractor.interface';
import { IInfraccion } from 'src/app/_models/infraccion.interface';
import { IInfractor } from 'src/app/_models/infractor.interface';
import { InfraccionService } from '../http/infraccion.service';
import { DataDatosInfractorService } from '../services/data-datos-infractor.service';
import { DatePipe } from '@angular/common'
import { ISala } from 'src/app/_models/sala.interface';

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

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private infraccionService: InfraccionService,
    public datePipe:DatePipe,
    private dataDatosInfractorSvc: DataDatosInfractorService
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
    }
  }


  loadInfracciones(infractorId: string): void {
    this.infraccionService.getInfracciones(infractorId).subscribe({
      next: (data: IInfraccion[]) => {
        this.infracciones = data;
        let dataGrid = this.infracciones.map(function(obj){
          return  {date:obj.fecha.toString() ,concept:'Infraccion pedagogica'} 
        });
        this.dataSource= new MatTableDataSource<infraccionGrid>(dataGrid);
      },
      error: (err: any) => { }
    });
  }

  onChangeSelectedSala(event : any){
    this.selectedSala=event;
  }

  schedule() {
   
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data=this.selectedSala;
    this.matDialog.open(ScheduleConfirmationDialogComponent, dialogConfig)
  }
}
