import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicMasterComponent } from './shared/layouts/public/master/master.component';
import { PUBLIC_ROUTES } from './shared/layouts/public/public.routes';
import { SecureMasterComponent } from './shared/layouts/secure/master/master.component';
import { SECURE_ROUTES } from './shared/layouts/secure/secure.routes';

const routes: Routes = [
  { path: '', redirectTo: 'infractor/login', pathMatch: 'full' },
  { path: '', component: PublicMasterComponent, data: { title: 'Login' }, children: PUBLIC_ROUTES },
  { path: '', component: SecureMasterComponent, data: { title: 'Dashboard' }, children: SECURE_ROUTES },
  { path: '**', redirectTo: 'infractor/login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
