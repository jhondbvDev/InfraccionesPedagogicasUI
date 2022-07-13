import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/public/services/storage.service';
import { AttendanceCheckingDialogComponent } from 'src/app/shared/dialogs/attendance-checking-dialog/attendance-checking-dialog.component';
import { UserCreationDialogComponent } from 'src/app/shared/dialogs/user-creation-dialog/user-creation-dialog.component';
import { ISala } from 'src/app/_models/sala.interface';
import { IUser, IUserInfo } from 'src/app/_models/user.interface';
import { FileUploadService } from '../http/file-upload.service';
import { SalaService } from '../http/sala.service';
import { UsuarioService } from '../http/usuario.service';

export interface Sala {
  infNumber: string;
  date: string;
  link: string;
  slots: number;
  teacher: string;
}

export interface SalaGrid {
  id: number;
  date: string;
  hour: string;
  link: string;
  slots: number;
  teacher: string;
}

export interface UsuarioGrid{
  id: string;
  name:string;
  email:string;
  role:string;
}

@Component({
  selector: 'app-dashboard-tmb',
  templateUrl: './dashboard-tmb.component.html',
  styleUrls: ['./dashboard-tmb.component.scss']
})
export class DashboardTmbComponent implements OnInit {

  salas! : ISala[];
  usuarios! : IUserInfo[];
  displayedColumns: string[] = ['teacher', 'link', 'slots','date', 'hour', 'attendanceAction'];
  displayedColumns2: string[] = ['name', 'email', 'role', 'deleteAction'];
  dataSource! :  MatTableDataSource<SalaGrid>;
  dataSource2! :  MatTableDataSource<UsuarioGrid>;
  selectedFile : File | undefined;

  constructor(
    private matDialog: MatDialog, 
    private snackBar : MatSnackBar, 
    private usuarioService : UsuarioService, 
    private salaService : SalaService, 
    private fileUploadService : FileUploadService,
    private storageService: StorageService) 
    {
    }

  ngOnInit() {
    this.loadSalas();
    this.loadUsers();
  }

  checkAttendance(salaId : number) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      canModify: false,
      salaId: salaId
    }

    this.matDialog.open(AttendanceCheckingDialogComponent, dialogConfig)
  }

  loadSalas(){
    this.salaService.getSalas().subscribe(
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
        console.log(errorContext.error);
      }
    )
  }

  loadUsers(){
    let userId = this.storageService.getUser().id;

    this.usuarioService.getUsers(userId).subscribe({
      next: (data: IUserInfo[]) => {
        this.usuarios = data;
        let dataGrid : UsuarioGrid[] = this.usuarios.map(function(user){
          return  {id: user.id, name:user.name, email : user.email, role: user.rol} 
        });
        this.dataSource2= new MatTableDataSource<UsuarioGrid>(dataGrid);
      },
      error: (err: any) => { }
    });
  }

  addUser() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;

    let dialogRef = this.matDialog.open(UserCreationDialogComponent, dialogConfig)

    dialogRef.afterClosed().subscribe(created => {
      if(created)
      {
        this.loadUsers();
      }
    });
  }

  deleteUser(userId : string) {
    this.usuarioService.deleteUser(userId).subscribe(
      data =>{
        this.snackBar.open(data);
        this.loadUsers();
      },
      errorContext =>{
        this.snackBar.open(errorContext.error);
      }
    )
  }

  csvInputChange(fileInputEvent: any) {
    this.selectedFile = fileInputEvent.target.files[0];
  }

  clearSelectedFile(){
    this.selectedFile = undefined;
  }

  uploadFile(){
    this.fileUploadService.processInfracciones(this.selectedFile!).subscribe(
      data => {
        if(data == true){
          this.snackBar.open("Archivo cargado con exito");
          this.clearSelectedFile();
        }
        else{
          this.snackBar.open("Error durante la carga del archivo, intente nuevamente");
        }
      },
      errorContext => {
        this.snackBar.open(errorContext.error);
      }
    )
  }
}
