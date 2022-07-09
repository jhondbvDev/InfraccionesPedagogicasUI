import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Asistencia {
  name: string;
  attendedClass: boolean;
}

const DATA: Asistencia[] = [
  { name: 'Pedro Martinez', attendedClass: true },
  { name: 'Marcos Lara', attendedClass: false },
  { name: 'Antonio Alvarez', attendedClass: false },
  { name: 'Gonzalo Hernandez', attendedClass: true },
  { name: 'Hector Silva', attendedClass: false }
];

@Component({
  selector: 'app-attendance-checking-dialog',
  templateUrl: './attendance-checking-dialog.component.html',
  styleUrls: ['./attendance-checking-dialog.component.scss']
})
export class AttendanceCheckingDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AttendanceCheckingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  displayedColumns: string[] = ['name', 'attendedClass'];
  dataSource = DATA;

  close() {
    this.dialogRef.close();
  }
}
