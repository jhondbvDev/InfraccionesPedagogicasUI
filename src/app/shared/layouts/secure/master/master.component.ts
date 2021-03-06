import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/public/http/auth.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class SecureMasterComponent implements OnInit {
  userName:string='';
  isInternal:boolean=false;
  constructor(private router: Router,private authService:AuthService) { }

  ngOnInit() {
    let userInfo = this.authService.getCurrentUser();
    this.userName = userInfo.name;
    this.isInternal = userInfo.type==="internal";
  }

  onLogout():void{
    this.authService.logout();
    this.router.navigateByUrl("funcionario/login");
  }

}
