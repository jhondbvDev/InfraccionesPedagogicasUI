import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AttendanceCheckingDialogComponent } from 'src/app/shared/dialogs/attendance-checking-dialog/attendance-checking-dialog.component';
import { RoomCreationDialogComponent } from 'src/app/shared/dialogs/room-creation-dialog/room-creation-dialog.component';

export interface Sala {
  infNumber: string;
  date: string;
  link: string;
  slots: number;
  teacher: string;
}

const DATA: Sala[] = [
  { infNumber: '12234355', date: '22/5/2022', link: 'Link', slots: 30, teacher: 'Mauricio Mercado'},
  { infNumber: '52667355', date: '22/5/2022', link: 'Link', slots: 25, teacher: 'Orlando Mejia'}
];

@Component({
  selector: 'app-dashboard-sm',
  templateUrl: './dashboard-sm.component.html',
  styleUrls: ['./dashboard-sm.component.scss']
})
export class DashboardSmComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  ngOnInit() {
  }

  displayedColumns: string[] = ['infNumber', 'date', 'link', 'slots', 'teacher', 'attendanceAction', 'editAction'];
  dataSource = DATA;

  checkAttendance() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      canModify: true
    }

    this.matDialog.open(AttendanceCheckingDialogComponent, dialogConfig)
  }

  addRoom() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;

    this.matDialog.open(RoomCreationDialogComponent, dialogConfig)
  }
}
