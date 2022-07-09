import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-infractor',
  templateUrl: './datos-infractor.component.html',
  styleUrls: ['./datos-infractor.component.scss']
})
export class DatosInfractorComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  confirmData() {
    this.router.navigateByUrl("infractor/dashboard");
  }

  cancel() {
    this.router.navigateByUrl("infractor/login");
  }
}
