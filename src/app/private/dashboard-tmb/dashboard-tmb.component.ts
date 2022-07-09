import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; 
import { AttendanceCheckingDialogComponent } from 'src/app/shared/dialogs/attendance-checking-dialog/attendance-checking-dialog.component';
import { UserCreationDialogComponent } from 'src/app/shared/dialogs/user-creation-dialog/user-creation-dialog.component';

export interface Sala {
  infNumber: string;
  date: string;
  link: string;
  slots: number;
  teacher: string;
}

const DATA: Sala[] = [
  { infNumber: '12234355', date: '22/5/2022', link: 'Link', slots: 30, teacher: 'Mauricio Mercado' },
  { infNumber: '52667355', date: '22/5/2022', link: 'Link', slots: 25, teacher: 'Orlando Mejia' }
];

export interface Usuario {
  name: string;
  username: string;
  creationDate: string;
}

const DATA2: Usuario[] = [
  { name: 'Carlos Perez', username: 'cperez', creationDate: '15/06/2022'},
  { name: 'Alvaro Martinez', username: 'amartinez', creationDate: '18/06/2022'}
];

@Component({
  selector: 'app-dashboard-tmb',
  templateUrl: './dashboard-tmb.component.html',
  styleUrls: ['./dashboard-tmb.component.scss']
})
export class DashboardTmbComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  ngOnInit() {
  }

  displayedColumns: string[] = ['infNumber', 'date', 'link', 'slots', 'teacher', 'attendanceAction'];
  displayedColumns2: string[] = ['name', 'username', 'editAction', 'deleteAction'];
  dataSource = DATA;
  dataSource2 = DATA2;

  checkAttendance() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      canModify: false
    }

    this.matDialog.open(AttendanceCheckingDialogComponent, dialogConfig)
  }

  addUser() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;

    this.matDialog.open(UserCreationDialogComponent, dialogConfig)
  }
}
