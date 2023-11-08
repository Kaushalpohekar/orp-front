import { NgModule } from '@angular/core';
import { CommonModule, DatePipe} from '@angular/common';

import { MatChipsModule } from '@angular/material/chips'; 
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ReportComponent } from './report/report.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { NavbarComponent } from './dashboard-layout/navbar/navbar.component';
import { SidebarComponent } from './dashboard-layout/sidebar/sidebar.component';
import { FooterComponent } from './dashboard-layout/footer/footer.component';
import { DataContainerComponent } from './dashboard-layout/data-container/data-container.component';
import { SublevelMenuComponent } from './dashboard-layout/sidebar/sublevel-menu.component';
import { SettingsComponent } from './settings/settings.component';
import { AddUserComponent } from './settings/add-user/add-user.component';
import { EditDeviceComponent } from './settings/edit-device/edit-device.component';
import { EditUserComponent } from './settings/edit-user/edit-user.component';
import { ProfileComponent } from './profile/profile.component';
import { AddDeviceComponent } from './settings/add-device/add-device.component';



@NgModule({
  declarations: [
    DashboardComponent,
    AnalysisComponent,
    ReportComponent,
    DashboardLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DataContainerComponent,
    SublevelMenuComponent,
    SettingsComponent,
    AddUserComponent,
    AddDeviceComponent,
    EditDeviceComponent,
    EditUserComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  providers: [
    DatePipe
  ]
})
export class DashboardModule { }
