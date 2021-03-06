
import { Routes } from '@angular/router';
import { DashboardAdminComponent } from 'src/app/private/dashboard-admin/dashboard-admin.component';
import { DashboardInfractorComponent } from 'src/app/private/dashboard-infractor/dashboard-infractor.component';
import { DashboardSmComponent } from 'src/app/private/dashboard-sm/dashboard-sm.component';
import { DashboardTmbComponent } from 'src/app/private/dashboard-tmb/dashboard-tmb.component';
import { DatosInfractorComponent } from 'src/app/private/datos-infractor/datos-infractor.component';
import { AuthGuard } from '../../guards/auth.guard';


export const SECURE_ROUTES: Routes = [
  { path: 'infractor/actualizacionDeDatos', component: DatosInfractorComponent },
  { path: 'infractor/dashboard', component: DashboardInfractorComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent ,canActivate:[AuthGuard]},
  { path: 'tmb/dashboard', component: DashboardTmbComponent ,canActivate:[AuthGuard]},
  { path: 'sm/dashboard', component: DashboardSmComponent,canActivate:[AuthGuard] },
];
