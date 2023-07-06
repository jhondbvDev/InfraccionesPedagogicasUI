import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/public/services/storage.service';
import { AttendanceCheckingDialogComponent } from 'src/app/shared/dialogs/attendance-checking-dialog/attendance-checking-dialog.component';
import { UserCreationDialogComponent } from 'src/app/shared/dialogs/user-creation-dialog/user-creation-dialog.component';
import { ISala } from 'src/app/_models/sala.interface';
import { IUserInfo } from 'src/app/_models/user.interface';
import { SalaService } from '../http/sala.service';
import { UsuarioService } from '../http/usuario.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit, AfterViewInit {

  pageSizeOptions : number[] = [5,10,25,50];

  @ViewChild("salaPaginator") salaPaginator! : MatPaginator;
  totalSalaRows : number = 0;
  currentPageSalas : number = 0;
  pageSizeSalas : number = 5;

  @ViewChild("userPaginator") userPaginator! : MatPaginator;
  totalUserRows : number = 0;
  currentPageUsers : number = 0;
  pageSizeUsers : number = 5;
 
  salas! : ISala[];
  usuarios! : IUserInfo[];
  displayedColumns: string[] = ['teacher', 'link', 'slots','date', 'hour', 'attendanceAction'];
  displayedColumns2: string[] = ['name', 'email', 'role', 'deleteAction'];
  dataSource :  MatTableDataSource<SalaGrid> = new MatTableDataSource;
  dataSource2 :  MatTableDataSource<UsuarioGrid> = new MatTableDataSource;

  constructor(
    private matDialog: MatDialog, 
    private snackBar : MatSnackBar, 
    private usuarioService : UsuarioService, 
    private salaService : SalaService,
    private clipboard:Clipboard, 
    private storageService: StorageService) 
    {
    }

  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.salaPaginator;
    this.dataSource2.paginator = this.userPaginator;
  }

  ngOnInit() {
    this.setupSalasInfo();
    this.setupUsersInfo();
  }

  checkAttendance(sala : ISala) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      canModify: false,
      salaId: sala.id,
      fecha:sala.fecha
    }

    this.matDialog.open(AttendanceCheckingDialogComponent, dialogConfig)
  }

  pageChangedSalas(event: PageEvent) {
    this.pageSizeSalas = event.pageSize;
    this.currentPageSalas = event.pageIndex;
    this.setupSalasInfo();
  }

  loadSalas(){
    this.salaService.getSalasWithPagination(this.currentPageSalas + 1, this.pageSizeSalas).subscribe(
      data => {
        this.salas = data;
        let dataGrid : SalaGrid[] = this.salas.map(function(sala){
          var fixedDate = new Date(sala.fecha);

          let hours = ("0" + fixedDate.getUTCHours()).slice(-2);
          let minutes = ("0" + fixedDate.getUTCMinutes()).slice(-2);

          return  {
            id: sala.id, 
            date: fixedDate.toLocaleDateString(), 
            hour: `${hours}:${minutes}`, 
            teacher: sala.nombreUsuario, 
            link: sala.link, 
            slots: sala.cupo,
            fecha:sala.fecha} 
        });
        this.dataSource.data = dataGrid;
        setTimeout(()=> 
        {
          this.salaPaginator.pageIndex = this.currentPageSalas;
          this.salaPaginator.length = this.totalSalaRows;
        });
      },
      errorContext => {
        console.log(errorContext.error);
      }
    )
  }

  countSalas(){
    this.salaService.getSalasCount().subscribe(
      data => {
        this.totalSalaRows = data;
      },
      errorContext => {
        this.snackBar.open(errorContext.error);
      }
    );
  }

  setupSalasInfo(){
    setTimeout(() => this.countSalas());
    this.loadSalas();
  }

  pageChangedUsers(event: PageEvent) {
    this.pageSizeUsers = event.pageSize;
    this.currentPageUsers = event.pageIndex;
    this.setupUsersInfo();
  }

  loadUsers(){
    let userId = this.storageService.getUser().id;

    this.usuarioService.getUsers(userId, this.currentPageUsers + 1, this.pageSizeUsers).subscribe({
      next: (data: IUserInfo[]) => {
        this.usuarios = data;
        let dataGrid : UsuarioGrid[] = this.usuarios.map(function(user){
          return  {id: user.id, name:user.name, email : user.email, role: user.rol} 
        });
        this.dataSource2.data = dataGrid;
        setTimeout(()=> 
        {
          this.userPaginator.pageIndex = this.currentPageUsers;
          this.userPaginator.length = this.totalUserRows;
        });
      },
      error: (err: any) => { }
    });
  }

  countUsers(){
    let userId = this.storageService.getUser().id;

    this.usuarioService.getUsersCount(userId).subscribe(
      data => {
        this.totalUserRows = data;
      },
      errorContext => {
        this.snackBar.open(errorContext.error);
      }
    );
  }

  setupUsersInfo(){
    setTimeout(() => this.countUsers());
    this.loadUsers();
  }

  addUser() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;

    let dialogRef = this.matDialog.open(UserCreationDialogComponent, dialogConfig)

    dialogRef.afterClosed().subscribe(created => {
      if(created)
      {
        this.setupUsersInfo();
      }
    });
  }

  deleteUser(userId : string) {
    this.usuarioService.deleteUser(userId).subscribe(
      data =>{
        
        if(data !== null)
        {
          this.snackBar.open("El usuario ha sido eliminado con exito.");
          this.setupUsersInfo();
        }
      },
      errorContext =>{
        this.snackBar.open(errorContext.error);
      }
    )
  }

  copyClipBoard(element:ISala){
    this.clipboard.copy(element.link);
  }
}
