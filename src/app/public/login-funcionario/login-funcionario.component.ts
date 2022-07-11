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
    username: new FormControl('', [Validators.required, Validators.pattern(this.isValidEmail)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  constructor(private router: Router,
    private storageService: StorageService, private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl("sm/dashboard");
    }
  }

  onLogin(): void {
    this.authService.getAuth(this.loginForm.value as IUser).subscribe(
      data => {
        this.storageService.saveToken(data.access_token);
        this.authService.setUserInfo();
        this.isLoginFailed = false;
        let userInfo = this.authService.getCurrentUser();
        let url = this.getUrlByRol(userInfo.rol);
        this.router.navigateByUrl(url);
      },
      err => {
        this.isLoginFailed = true;
        this.errorMessage = "user or password invalid";
      })
  }

  private getUrlByRol(rol:string):string{
    return rol.toLowerCase()==="tmb"?"tmb/dashboard":"sm/dashboard";
  }

}
