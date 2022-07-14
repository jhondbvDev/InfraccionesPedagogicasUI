import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalaService } from 'src/app/private/http/sala.service';
import { StorageService } from 'src/app/public/services/storage.service';
import { IEditSala, INewSala, ISala } from 'src/app/_models/sala.interface';

@Component({
  selector: 'app-room-creation-dialog',
  templateUrl: './room-creation-dialog.component.html',
  styleUrls: ['./room-creation-dialog.component.scss']
})
export class RoomCreationDialogComponent implements OnInit {

  selectedSala! : ISala;
  public roomCreationForm : FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RoomCreationDialogComponent>, 
    private snackBar : MatSnackBar, 
    private storageService: StorageService, 
    private salaService : SalaService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
     
    if(data.isCreation){
      this.roomCreationForm =  new FormGroup({
        link: new FormControl('', [Validators.required, Validators.minLength(3)]),
        cupo: new FormControl('', [Validators.required])
      });
    }
    else{
      this.roomCreationForm =  new FormGroup({
        link: new FormControl(data.room.link, [Validators.required, Validators.minLength(3)]),
        cupo: new FormControl(data.room.cupo, [Validators.required])
      });

    }
    this.selectedSala=data.room;
  }

  ngOnInit() {
  }

  close(result: boolean) {
    this.dialogRef.close(result);
  }

  onChangeSelectedSala(event : any){
    this.selectedSala=event;
  }


  
  submitForm(){
    if(this.roomCreationForm.valid){
      if(this.selectedSala){
        if(this.data.isCreation){
          var activeUser = this.storageService.getUser();
      
          let newSala : INewSala = {
            link : this.roomCreationForm.value.link,
            cupo : this.roomCreationForm.value.cupo,
            fecha : new Date(this.selectedSala.fecha.toString().slice(0,28)),
            usuarioId : activeUser.id
          }
          
          this.salaService.createSala(newSala).subscribe(
            data =>{
              this.snackBar.open(data);
              this.close(true);
            },
            errorContext =>{
              this.snackBar.open(errorContext.error);
            }
          )
        }
        else{
          let updatedSala : IEditSala = {
            id : this.data.room.id,
            link : this.roomCreationForm.value.link,
            cupo : this.roomCreationForm.value.cupo,
            fecha : new Date(this.selectedSala.fecha.toString().slice(0,28))
          }

          this.salaService.updateSala(updatedSala).subscribe(
            data =>{
              this.snackBar.open(data);
              this.close(true);
            },
            errorContext =>{
              this.snackBar.open(errorContext.error);
            }
          )
        }
      }
      else{
        console.log("error calendario")
      }
    }
    else{
      console.log("error")
    }
  }
}
