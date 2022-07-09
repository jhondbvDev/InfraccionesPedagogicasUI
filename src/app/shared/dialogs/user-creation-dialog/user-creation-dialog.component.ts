import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-creation-dialog',
  templateUrl: './user-creation-dialog.component.html',
  styleUrls: ['./user-creation-dialog.component.scss']
})
export class UserCreationDialogComponent implements OnInit {

  constructor(private dialogRef : MatDialogRef<UserCreationDialogComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
