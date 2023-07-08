import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/public/services/storage.service';
import { AttendanceCheckingDialogComponent } from 'src/app/shared/dialogs/attendance-checking-dialog/attendance-checking-dialog.component';
import { RoomCreationDialogComponent } from 'src/app/shared/dialogs/room-creation-dialog/room-creation-dialog.component';
import { ISala } from 'src/app/_models/sala.interface';
import { AsistenciaService } from '../http/asistencia.service';
import { SalaService } from '../http/sala.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { IResponse } from 'src/app/_models/response.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface SalaGrid {
  id: number;
  date: Date;
  hour: string;
  link: string;
  slots: number;
  teacher: string;
  fecha: Date;
  totalslots: number;
}

@Component({
  selector: 'app-dashboard-sm',
  templateUrl: './dashboard-sm.component.html',
  styleUrls: ['./dashboard-sm.component.scss']
})
export class DashboardSmComponent implements OnInit, AfterViewInit {

  @ViewChild("salaPaginator") salaPaginator! : MatPaginator;
  totalRows : number = 0;
  currentPage : number = 0;
  pageSize : number = 5;
  pageSizeOptions : number[] = [5,10,25,50];

  userId: string;
  salas!: ISala[];
  dataSource : MatTableDataSource<SalaGrid> = new MatTableDataSource();
  displayedColumns: string[] = ['teacher', 'link', 'slots', 'totalslots', 'date', 'hour', 'attendanceAction', 'editAction', 'deleteAction'];

  constructor(
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private salaService: SalaService,
    private clipboard: Clipboard,
    private storageService: StorageService,
    private asistenciaService: AsistenciaService,
  ) {
    this.userId = this.storageService.getUser().id;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.salaPaginator;
  }

  ngOnInit() {
    setTimeout(() => this.countSalas());
    this.loadSalas();
  }

  checkAttendance(sala: ISala) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      canModify: true,
      salaId: sala.id,
      fecha: sala.fecha
    }

    this.matDialog.open(AttendanceCheckingDialogComponent, dialogConfig)
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setupInfo();
  }

  loadSalas() {
    this.salaService.getSalasForUser(this.userId, this.currentPage + 1, this.pageSize).subscribe(
      data => {
        this.salas = data;
        let dataGrid: SalaGrid[] = this.salas.map(function (sala) {
          var fixedDate = new Date(sala.fecha);
          
          return {
            id: sala.id,
            date: fixedDate,
            hour : "1",
            teacher: sala.nombreUsuario,
            link: sala.link,
            slots: sala.cupo,
            totalslots: sala.totalCupo,
            fecha: fixedDate
          }
        });
        this.dataSource.data = dataGrid;
        setTimeout(()=> 
        {
          this.salaPaginator.pageIndex = this.currentPage;
          this.salaPaginator.length = this.totalRows;
        });
        
      },
      errorContext => {
        this.snackBar.open(errorContext.error, undefined, {
          panelClass: ['failure']
        });
      }
    )
  }

  countSalas(){
    this.salaService.getSalasCountForUser(this.userId).subscribe(
      data => {
        this.totalRows = data;
      },
      errorContext => {
        this.snackBar.open(errorContext.error, undefined, {
          panelClass: ['failure']
        });
      }
    );
  }

  addRoom() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      isCreation: true
    }

    let dialogRef = this.matDialog.open(RoomCreationDialogComponent, dialogConfig)

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.setupInfo();
      }
    })
  }

  editRoom(roomData: SalaGrid) {
    this.asistenciaService.hasRegisteredInfractores(roomData.id).subscribe(
      data => {
        if (data == true) {
          this.snackBar.open("Esta sala no se puede editar ya que contiene infractores registrados", undefined, {
            panelClass: ['warning']
          });
        }
        else {
          let dialogConfig = new MatDialogConfig();
          dialogConfig.width = '600px';
          dialogConfig.disableClose = true;
          dialogConfig.data = {
            isCreation: false,
            room: {
              id: roomData.id,
              fecha: roomData.fecha,
              totalCupo: roomData.totalslots,
              cupo: roomData.slots,
              link: roomData.link
            }
          }
          let dialogRef = this.matDialog.open(RoomCreationDialogComponent, dialogConfig)

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.setupInfo();
            }
          })
        }
      },
      errorContext => {
        this.snackBar.open(errorContext.error, undefined, {
          panelClass: ['failure']
        });
      }
    );
  }

  copyClipBoard(element: ISala) {
    this.clipboard.copy(element.link);
  }

  deleteRoom(salaId: number) {
    this.salaService.deleteSala(salaId).subscribe({
      next: () => {
        this.snackBar.open("Sala eliminada con exito", undefined, {
          panelClass: ['success']
        });
        
        this.setupInfo();
      },
      error: (err: any) => {
        if(err.error)
        {
          this.snackBar.open(err.error.errorMessage, undefined, {
            panelClass: ['failure']
          });
        }
        else{
          this.snackBar.open("Ocurrio un error, por favor comuniquese con el administrador o  intente mas tarde.", undefined, {
            panelClass: ['failure']
          });
        }
      }

      // this.asistenciaService.hasRegisteredInfractores(salaId).subscribe(
      //   data =>{
      //     // if(data == true){
      //     //   this.snackBar.open("Esta sala no se puede eliminarse ya que contiene infractores registrados, puede eliminarla 2 horas despues de la hora de inicio.");
      //     // }
      //     // else{
      //     //   this.salaService.deleteSala(salaId).subscribe(
      //     //     data => {
      //     //       if(data == true){
      //     //         this.snackBar.open("Sala eliminada con exito");
      //     //         this.loadSalas();
      //     //       }
      //     //       else{
      //     //         this.snackBar.open("Error durante el proceso de eliminacion de sala, intente nuevamente");
      //     //       }
      //     //     },
      //     //     errorContext =>{
      //     //       this.snackBar.open(errorContext.error);
      //     //     }
      //     //   )
      //     // }
      //   },
      //   errorContext => {
      //     this.snackBar.open(errorContext.error);
      //   }
      //   );
    })
  }

  setupInfo(){
    setTimeout(() => this.countSalas());
    this.loadSalas();
  }
}
