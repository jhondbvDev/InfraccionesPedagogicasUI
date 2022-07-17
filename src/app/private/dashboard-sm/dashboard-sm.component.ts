import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/public/services/storage.service';
import { AttendanceCheckingDialogComponent } from 'src/app/shared/dialogs/attendance-checking-dialog/attendance-checking-dialog.component';
import { RoomCreationDialogComponent } from 'src/app/shared/dialogs/room-creation-dialog/room-creation-dialog.component';
import { ISala } from 'src/app/_models/sala.interface';
import { AsistenciaService } from '../http/asistencia.service';
import { SalaService } from '../http/sala.service';
import {Clipboard} from '@angular/cdk/clipboard';

export interface SalaGrid {
  id: number;
  date: string;
  hour: string;
  link: string;
  slots: number;
  teacher: string;
  fecha:Date;
  totalslots:number;
}

@Component({
  selector: 'app-dashboard-sm',
  templateUrl: './dashboard-sm.component.html',
  styleUrls: ['./dashboard-sm.component.scss']
})
export class DashboardSmComponent implements OnInit {

  userId : string;
  salas! : ISala[];
  dataSource! :  MatTableDataSource<SalaGrid>;
  displayedColumns: string[] = ['teacher', 'link', 'slots','totalslots','date', 'hour', 'attendanceAction', 'editAction', 'deleteAction'];

  constructor(
    private matDialog: MatDialog, 
    private snackBar : MatSnackBar,
    private salaService : SalaService, 
    private clipboard:Clipboard, 
    private storageService : StorageService,  
    private asistenciaService : AsistenciaService,
    ) { 
    this.userId = this.storageService.getUser().id;
  }

  ngOnInit() {
    this.loadSalas();
  }

  checkAttendance(sala : ISala) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      canModify: true,
      salaId: sala.id,
      fecha:sala.fecha
    }

    this.matDialog.open(AttendanceCheckingDialogComponent, dialogConfig)
  }

  loadSalas(){
    this.salaService.getSalasForUser(this.userId).subscribe(
      data => {
        this.salas = data;
        let dataGrid : SalaGrid[] = this.salas.map(function(sala){
          var fixedDate = new Date(sala.fecha);

          return  {
            id: sala.id, 
            date: fixedDate.toLocaleDateString(), 
            hour: fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}), 
            teacher: sala.nombreUsuario, 
            link: sala.link, 
            slots: sala.cupo,
            totalslots:sala.totalCupo,
            fecha:fixedDate} 
        });
        this.dataSource= new MatTableDataSource<SalaGrid>(dataGrid);
      },
      errorContext => {
        this.snackBar.open(errorContext.error);
      }
    )
  }

  addRoom() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      isCreation : true
    }

    let dialogRef = this.matDialog.open(RoomCreationDialogComponent, dialogConfig)

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadSalas();
      }
    })
  }

  editRoom(roomData: SalaGrid) {
    this.asistenciaService.hasRegisteredInfractores(roomData.id).subscribe(
      data =>{
        if(data == true){
          this.snackBar.open("Esta sala no se puede editar ya que contiene infractores registrados");
        }
        else{
          let dialogConfig = new MatDialogConfig();
          dialogConfig.width = '600px';
          dialogConfig.disableClose = true;
          dialogConfig.data = {
            isCreation : false,
            room: {
              id: roomData.id,
              fecha: roomData.fecha,
              totalCupo : roomData.totalslots,
              cupo:roomData.slots,
              link : roomData.link
            }
          }
          let dialogRef = this.matDialog.open(RoomCreationDialogComponent, dialogConfig)

          dialogRef.afterClosed().subscribe(result => {
            if(result){
              this.loadSalas();
            }
          })
        }
      },
      errorContext => {
        this.snackBar.open(errorContext.error);
      }
      );
  }

  copyClipBoard(element:ISala){
    this.clipboard.copy(element.link);
  }
  deleteRoom(salaId : number){
    this.asistenciaService.hasRegisteredInfractores(salaId).subscribe(
      data =>{
        if(data == true){
          this.snackBar.open("Esta sala no se puede eliminarse ya que contiene infractores registrados");
        }
        else{
          this.salaService.deleteSala(salaId).subscribe(
            data => {
              if(data == true){
                this.snackBar.open("Sala eliminada con exito");
                this.loadSalas();
              }
              else{
                this.snackBar.open("Error durante el proceso de eliminacion de sala, intente nuevamente");
              }
            },
            errorContext =>{
              this.snackBar.open(errorContext.error);
            }
          )
        }
      },
      errorContext => {
        this.snackBar.open(errorContext.error);
      }
      );
  }
}
