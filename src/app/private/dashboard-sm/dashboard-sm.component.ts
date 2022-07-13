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

export interface SalaGrid {
  id: number;
  date: string;
  hour: string;
  link: string;
  slots: number;
  teacher: string;
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
  displayedColumns: string[] = ['teacher', 'link', 'slots','date', 'hour', 'attendanceAction', 'editAction'];

  constructor(
    private matDialog: MatDialog, 
    private snackBar : MatSnackBar,
    private salaService : SalaService, 
    private storageService : StorageService,  
    private asistenciaService : AsistenciaService) { 
    this.userId = this.storageService.getUser().id;
  }

  ngOnInit() {
    this.loadSalas();
  }

  checkAttendance(salaId : number) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      canModify: true,
      salaId: salaId
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
            hour: fixedDate.toLocaleTimeString(), 
            teacher: sala.nombreUsuario, 
            link: sala.link, 
            slots: sala.cupo} 
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
              fecha: new Date(`${roomData.date}, ${roomData.hour}`),
              // hour : roomData.hour,
              cupo : roomData.slots,
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
}
