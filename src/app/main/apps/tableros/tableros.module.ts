import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tablero1Component } from './tablero1/tablero1.component';
import { SecurityGuard } from '../../guards/security.guard';
import { Routes, RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgGridModule } from 'ag-grid-angular';
import { FuseWidgetModule } from '@fuse/components';
import { MatButtonModule, MatIconModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatButtonToggleModule, MatCardModule, MatDividerModule, MatTableModule, MatSelectModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ComponentsModule } from 'app/main/components/components.module';
import { HomeComponent } from './home/home.component';
import { DmhoxidosComponent } from './dashbalance/dmhoxidos/dmhoxidos.component';
import { KpibalanceComponent } from './dashbalance/kpibalance/kpibalance.component';
import { MonitoreocorporativoComponent } from './monitoreocorporativo/monitoreocorporativo.component';
import { MonitoreobalancedmhComponent } from './dashbalance/monitoreobalancedmh/monitoreobalancedmh.component';
import { MonitoreobalancertComponent } from './dashbalance/monitoreobalancert/monitoreobalancert.component';
import { MonitoreobalancedgmComponent } from './dashbalance/monitoreobalancedgm/monitoreobalancedgm.component';
import { MonitoreoVwComponent } from './dashbalance/monitoreo-vw/monitoreo-vw.component';
import { KpibalanceVWComponent } from './dashbalance/kpibalance-vw/kpibalance-vw.component';
import { MonitoreobalancedchComponent } from './dashbalance/monitoreobalancedch/monitoreobalancedch.component';
import { MonitoreobalancedsaComponent } from './dashbalance/monitoreobalancedsa/monitoreobalancedsa.component';
import { MonitoreobalancedanComponent } from './dashbalance/monitoreobalancedan/monitoreobalancedan.component';
import { MonitoreobalancedveComponent } from './dashbalance/monitoreobalancedve/monitoreobalancedve.component';
import { TablaDRTComponent } from './dashbalance/tabla-drt/tabla-drt.component';
import { TablaDMHComponent } from './dashbalance/tabla-dmh/tabla-dmh.component';
import { TablaDANComponent } from './dashbalance/tabla-dan/tabla-dan.component';
import { TablaDCHComponent } from './dashbalance/tabla-dch/tabla-dch.component';
import { MonitoreoVW2Component } from './dashbalance/monitoreo-vw2/monitoreo-vw2.component';
import { TablaDGMComponent } from './dashbalance/tabla-dgm/tabla-dgm.component';
import { KpibalanceVW2Component } from './dashbalance/kpibalance-vw2/kpibalance-vw2.component';
import { MonitoreoVW3Component } from './dashbalance/monitoreo-vw3/monitoreo-vw3.component';



const routes: Routes = [
  {
    path: 'tablero1',
    component: Tablero1Component,
    canActivate: [SecurityGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'dmhoxidos',
    component: DmhoxidosComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'kpibalance',
    component: KpibalanceComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreo',
    component: MonitoreocorporativoComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreobalancedmh',
    component: MonitoreobalancedmhComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreobalancert',
    component: MonitoreobalancertComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreobalancedgm',
    component: MonitoreobalancedgmComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreobalancedch',
    component: MonitoreobalancedchComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreobalancedsa',
    component: MonitoreobalancedsaComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreobalancedan',
    component: MonitoreobalancedanComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreobalancedve',
    component: MonitoreobalancedveComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'tabladrt',
    component: TablaDRTComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'tabladmh',
    component: TablaDMHComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'tabladan',
    component: TablaDANComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'tabladch',
    component: TablaDCHComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'tabladgm',
    component: TablaDGMComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreoVW2',
    component: MonitoreoVW2Component,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreoVW3',
    component: MonitoreoVW3Component,
    canActivate: [SecurityGuard]
  },
  {
    path: 'monitoreoVW',
    component: MonitoreoVwComponent,
    canActivate: [SecurityGuard]
  },
  {
    path: 'kpibalanceVW2',
    component: KpibalanceVW2Component,
    canActivate: [SecurityGuard]
  },
  {
    path: 'kpibalanceVW',
    component: KpibalanceVWComponent,
    canActivate: [SecurityGuard]
  }
];

@NgModule({
  declarations: [Tablero1Component, HomeComponent, DmhoxidosComponent, KpibalanceComponent, MonitoreocorporativoComponent, MonitoreobalancedmhComponent, MonitoreobalancertComponent, MonitoreoVwComponent, KpibalanceVWComponent, MonitoreobalancedgmComponent, MonitoreobalancedchComponent, MonitoreobalancedsaComponent, MonitoreobalancedanComponent, MonitoreobalancedveComponent, TablaDRTComponent, TablaDMHComponent, TablaDANComponent, MonitoreoVW2Component, TablaDCHComponent, TablaDGMComponent, KpibalanceVW2Component, MonitoreoVW3Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    HighchartsChartModule,
    AgGridModule.withComponents([]),
    FuseWidgetModule,
    FuseSharedModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule
  ]
})
export class TablerosModule { }
