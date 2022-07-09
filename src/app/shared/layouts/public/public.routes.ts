
import { Routes, RouterModule } from '@angular/router';
import { LoginFuncionarioComponent } from 'src/app/public/login-funcionario/login-funcionario.component';
import { LoginInfractorComponent } from 'src/app/public/login-infractor/login-infractor.component';


export const PUBLIC_ROUTES: Routes = [
  { path: '', redirectTo: 'infractor/login', pathMatch: 'full' },
  { path: 'infractor/login', component: LoginInfractorComponent },
  { path: 'funcionario/login', component: LoginFuncionarioComponent }
];
