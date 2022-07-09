import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-infractor',
  templateUrl: './login-infractor.component.html',
  styleUrls: ['./login-infractor.component.scss']
})
export class LoginInfractorComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  authenticate() {
    this.router.navigateByUrl("infractor/actualizacionDeDatos");
  }
}
