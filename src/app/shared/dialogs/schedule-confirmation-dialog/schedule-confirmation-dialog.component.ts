import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISala } from 'src/app/_models/sala.interface';



@Component({
  selector: 'app-schedule-confirmation-dialog',
  templateUrl: './schedule-confirmation-dialog.component.html',
  styleUrls: ['./schedule-confirmation-dialog.component.scss']
})
export class ScheduleConfirmationDialogComponent implements OnInit {
  confirmData!:ISala;
  constructor(
    private dialogRef : MatDialogRef<ScheduleConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.confirmData=data;
    }

  ngOnInit() {
    console.log('dialog data :');
    console.log(this.data);
  }

  close() {
    this.dialogRef.close();
  }
}
