import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AsistenciaService } from 'src/app/private/http/asistencia.service';
import { IAsistenciaDeep, IUpdateAsistencia } from 'src/app/_models/asistencia.interface';
import { saveAs } from 'file-saver';
import { SpinnerService } from '../../services/spinner.service';

export interface AsistenciaGrid {
  id: number;
  name: string;
  attendedClass: boolean;
}

@Component({
  selector: 'app-attendance-checking-dialog',
  templateUrl: './attendance-checking-dialog.component.html',
  styleUrls: ['./attendance-checking-dialog.component.scss']
})
export class AttendanceCheckingDialogComponent implements OnInit {

  asistencias!: IAsistenciaDeep[];
  displayedColumns: string[] = ['name', 'attendedClass'];
  dataSource = new MatTableDataSource<AsistenciaGrid>;

  constructor(
    private dialogRef: MatDialogRef<AttendanceCheckingDialogComponent>,
    private asistenciaService: AsistenciaService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.loadAttendance();
  }

  ngOnInit() {
  }

  loadAttendance() {
    this.asistenciaService.getAsistenciaBySala(this.data.salaId).subscribe(
      data => {
        this.asistencias = data;
        let dataGrid: AsistenciaGrid[] = this.asistencias.map(function (asistencia) {
          return {
            id: asistencia.id,
            name: asistencia.nombreInfractor,
            attendedClass: asistencia.asistio
          }
        });
        this.dataSource = new MatTableDataSource<AsistenciaGrid>(dataGrid);
      },
      errorContext => {
        console.log(errorContext.error);
      }
    )
  }

  onAttendanceChange($event: any, attendanceId: number) {
    let updatedAttendance: IUpdateAsistencia = {
      id: attendanceId,
      asistio: $event.checked
    }

    this.asistenciaService.updateAsitencia(updatedAttendance).subscribe(
      data => {
      },
      errorContext => {
        this.snackBar.open(errorContext.error);
        this.close();
      }
    )
  }

  close() {
    this.dialogRef.close();
  }

  exportExcel(): void {
    if (this.asistencias.length > 0) {
      const date = this.data.fecha;
      this.asistenciaService.getAsistenciaExcelBySala(this.data.salaId).subscribe(
        {
          next: (result: any) => {

            let file = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let fileName = `Asistencias-${date?.toLocaleString().substring(0,10)}.xlsx`;

            saveAs(file, fileName);

          },
          error: (err: any) => {

            this.snackBar.open("Ocurrio un error descargando el archivo.");
          }
        }
      )
    }
    else {
      this.snackBar.open("No es posible exportar a excel , no hay informacion");
    }

  }
}
