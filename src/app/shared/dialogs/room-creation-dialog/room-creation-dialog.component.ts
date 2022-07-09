import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room-creation-dialog',
  templateUrl: './room-creation-dialog.component.html',
  styleUrls: ['./room-creation-dialog.component.scss']
})
export class RoomCreationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RoomCreationDialogComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
