import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-confirmation-dialog',
  templateUrl: './schedule-confirmation-dialog.component.html',
  styleUrls: ['./schedule-confirmation-dialog.component.scss']
})
export class ScheduleConfirmationDialogComponent implements OnInit {

  constructor(private dialogRef : MatDialogRef<ScheduleConfirmationDialogComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
