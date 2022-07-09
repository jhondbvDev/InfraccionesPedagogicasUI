import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ScheduleConfirmationDialogComponent } from 'src/app/shared/dialogs/schedule-confirmation-dialog/schedule-confirmation-dialog.component';

export interface Infraccion {
  date: string;
  concept: string;
}

const DATA: Infraccion[] = [
  { date: '23/9/2022', concept: 'Infraccion Pedagogica' },
  { date: '27/9/2022', concept: 'Infraccion Pedagogica'}
];

@Component({
  selector: 'app-dashboard-infractor',
  templateUrl: './dashboard-infractor.component.html',
  styleUrls: ['./dashboard-infractor.component.scss']
})
export class DashboardInfractorComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  ngOnInit() {
  }

  displayedColumns: string[] = ['date', 'concept'];
  dataSource = DATA;

  schedule() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = true;
    this.matDialog.open(ScheduleConfirmationDialogComponent, dialogConfig)
  }
}
