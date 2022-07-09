import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatTooltipModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatTableModule,
  MatDialogModule,
  MatCheckboxModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule

]

@NgModule({
  exports: [materialModules],
  imports: [materialModules]
})
export class MaterialModule { }
