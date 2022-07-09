import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/_models/user.interface';
 
import { AuthService } from '../http/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login-funcionario',
  templateUrl: './login-funcionario.component.html',
  styleUrls: ['./login-funcionario.component.scss']
})
export class LoginFuncionarioComponent implements OnInit {
  private isValidEmail = /\S+@\S+\.\S+/;
  isLoginFailed: boolean = false;
  errorMessage: string = '';
  loginForm =  new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.isValidEmail)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  constructor(private router: Router, private fb: FormBuilder,
    private storageService: StorageService, private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl("sm/dashboard");
    }
  }

  onLogin(): void {
    console.log(this.loginForm.value);
    // this.authService.getAuth(form).subscribe(
    //   d => {
    //     this.storageService.saveToken(d.access_token);
    //     this.authService.setUserInfo();
    //     this.isLoginFailed = false;
    //     this.router.navigateByUrl("sm/dashboard");
    //   },
    //   err => {
    //     this.isLoginFailed = true;
    //     this.errorMessage = "user or password invalid";
    //   })
  }
  authenticate() {
    
  }
}
