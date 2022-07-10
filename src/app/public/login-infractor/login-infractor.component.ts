import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IInfractor } from 'src/app/_models/infractor.interface';
import { LoginInfractorService } from '../http/login-infractor.service';

@Component({
  selector: 'app-login-infractor',
  templateUrl: './login-infractor.component.html',
  styleUrls: ['./login-infractor.component.scss']
})
export class LoginInfractorComponent implements OnInit {

  loginInfractor :FormGroup;
  isLoginFailed:boolean=false;
  errorMessage:string='';
  constructor(private router : Router,
    private loginInfractorService:LoginInfractorService) {
      this.loginInfractor= new FormGroup({
        documento : new FormControl('',[Validators.required,Validators.minLength(6)]),
      })
     }

  ngOnInit() {

  }

  authenticate() {
    this.loginInfractorService.getInfractor(this.loginInfractor.value.documento!).subscribe(
      {
        next: (data: IInfractor) => {
          this.isLoginFailed=false;
          this.router.navigateByUrl("infractor/actualizacionDeDatos");
        },
        error: (err: any) =>{
          this.isLoginFailed = true;
          this.errorMessage = err.error;
        } 
      }
    );
  }

  onFormChange():void{
    this.isLoginFailed=false;
  }

}
