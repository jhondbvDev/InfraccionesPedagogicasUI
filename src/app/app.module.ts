import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginInfractorComponent } from './public/login-infractor/login-infractor.component';
import { LoginFuncionarioComponent } from './public/login-funcionario/login-funcionario.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardInfractorComponent } from './private/dashboard-infractor/dashboard-infractor.component';
import { DatosInfractorComponent } from './private/datos-infractor/datos-infractor.component';
import { DashboardTmbComponent } from './private/dashboard-tmb/dashboard-tmb.component';
import { DashboardSmComponent } from './private/dashboard-sm/dashboard-sm.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicMasterComponent } from './shared/layouts/public/master/master.component';
import { SecureMasterComponent } from './shared/layouts/secure/master/master.component';
import { ScheduleConfirmationDialogComponent } from './shared/dialogs/schedule-confirmation-dialog/schedule-confirmation-dialog.component';
import { AttendanceCheckingDialogComponent } from './shared/dialogs/attendance-checking-dialog/attendance-checking-dialog.component';
import { RoomCreationDialogComponent } from './shared/dialogs/room-creation-dialog/room-creation-dialog.component';
import { UserCreationDialogComponent } from './shared/dialogs/user-creation-dialog/user-creation-dialog.component';
import { MeetingCalendarComponent } from './shared/components/meeting-calendar/meeting-calendar.component';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor, spinnerInterceptorProvider } from './shared/interceptors/spinner.interceptor';
import { DataDatosInfractorService } from './private/services/data-datos-infractor.service';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    PublicMasterComponent,
    SecureMasterComponent,
    LoginInfractorComponent,
    LoginFuncionarioComponent,
    DashboardInfractorComponent,
    DatosInfractorComponent,
    ScheduleConfirmationDialogComponent,
    DashboardTmbComponent,
    DashboardSmComponent,
    AttendanceCheckingDialogComponent,
    RoomCreationDialogComponent,
    UserCreationDialogComponent,
    MeetingCalendarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  entryComponents: [
    ScheduleConfirmationDialogComponent,
    AttendanceCheckingDialogComponent,
    RoomCreationDialogComponent,
    UserCreationDialogComponent
  ],
  providers: [spinnerInterceptorProvider,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
