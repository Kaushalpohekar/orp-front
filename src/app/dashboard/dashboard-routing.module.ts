import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: 'overview', component: DashboardComponent },
  { path: 'analysis', component:AnalysisComponent },
  { path: 'report', component:ReportComponent},
  { path: '', redirectTo: 'overview', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
