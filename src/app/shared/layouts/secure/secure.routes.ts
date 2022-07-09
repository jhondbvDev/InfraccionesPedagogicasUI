
import { Routes, RouterModule } from '@angular/router';
import { DashboardInfractorComponent } from 'src/app/private/dashboard-infractor/dashboard-infractor.component';
import { DashboardSmComponent } from 'src/app/private/dashboard-sm/dashboard-sm.component';
import { DashboardTmbComponent } from 'src/app/private/dashboard-tmb/dashboard-tmb.component';
import { DatosInfractorComponent } from 'src/app/private/datos-infractor/datos-infractor.component';

import { AuthGuard } from '../../guards/auth.guard';

export const SECURE_ROUTES: Routes = [
  { path: 'infractor/actualizacionDeDatos', component: DatosInfractorComponent },
  { path: 'infractor/dashboard', component: DashboardInfractorComponent },
  { path: 'tmb/dashboard', component: DashboardTmbComponent },
  { path: 'sm/dashboard', component: DashboardSmComponent },
];
