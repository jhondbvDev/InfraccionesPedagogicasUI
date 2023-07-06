import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/private/http/usuario.service';
import { INewUserInfo, IUserInfo } from 'src/app/_models/user.interface';
@Component({
  selector: 'app-user-creation-dialog',
  templateUrl: './user-creation-dialog.component.html',
  styleUrls: ['./user-creation-dialog.component.scss']
})
export class UserCreationDialogComponent implements OnInit {

  private isValidEmail = /\S+@\S+\.\S+/;
  public userCreationForm : FormGroup;
  
  constructor(private dialogRef : MatDialogRef<UserCreationDialogComponent>, private snackBar : MatSnackBar,  private usuarioService: UsuarioService) { 
    this.userCreationForm =  new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.isValidEmail)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
      rol: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  submitForm(){
    if(this.userCreationForm.valid){
      if(this.userCreationForm.value.password === this.userCreationForm.value.confirmPassword){
        let newUserData : INewUserInfo = {
          username : this.userCreationForm.value.username,
          email : this.userCreationForm.value.email,
          password : this.userCreationForm.value.password,
          rol : this.userCreationForm.value.rol
        }

        this.usuarioService.registerUser(newUserData).subscribe(
          data =>{
            if(data !== null){
              this.snackBar.open("Usuario creado con exito.");
              this.close(true);
            }
          },
          errorContext =>{
            let error_obj = JSON.parse(errorContext.error);

            if(error_obj.errors !== null && error_obj.errors !== undefined)
            {
              let errors = "";

              error_obj.errors.forEach(error => {
                errors += error.msg + "\n";
              });

              this.snackBar.open(errors);
            }
            else
            {
              this.snackBar.open(errorContext.error);
            }
          }
        )
      }
      else{
        this.snackBar.open("Las contraseña y confirmacion de contraseña deben ser iguales.");
      }
    }
    else{
      console.log("error")
    }
  }

  close(result : boolean) {
    this.dialogRef.close(result);
  }
}
