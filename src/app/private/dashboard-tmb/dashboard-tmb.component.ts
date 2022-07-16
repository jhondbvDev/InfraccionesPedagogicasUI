import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploadService } from '../http/file-upload.service';

@Component({
  selector: 'app-dashboard-tmb',
  templateUrl: './dashboard-tmb.component.html',
  styleUrls: ['./dashboard-tmb.component.scss']
})
export class DashboardTmbComponent implements OnInit {

  selectedFile : File | undefined;

  constructor(
    private snackBar : MatSnackBar,
    private fileUploadService : FileUploadService) 
  {
  }

  ngOnInit() {
  }

  csvInputChange(fileInputEvent: any) {
    this.selectedFile = fileInputEvent.target.files[0];
  }

  clearSelectedFile(){
    this.selectedFile = undefined;
  }

  uploadFile(){
    this.fileUploadService.processInfracciones(this.selectedFile!).subscribe({
      next:(data:boolean)=>{
         if(data == true){
          this.snackBar.open("Archivo cargado con exito");
          this.clearSelectedFile();
        }
        else{
          this.snackBar.open("Error durante la carga del archivo, intente nuevamente");
        }
      },
      error:(err:any)=>{
        this.snackBar.open(err.error);
      }
    });
  }
}
