import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { GroupsGroupFormDialogComponent } from './groups-form/groups-form.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { SelectedBarComponent } from './selected-bar/selected-bar.component';
import { GroupsMainSidebarComponent } from './sidebars/main/main.component';
import { GroupsComponent } from './groups.component';
import { GroupsService } from './groups.service';
import { ComponentsModule } from '../../../components/components.module';

const routes: Routes = [
  {
      path     : '**',
       component: GroupsComponent,
      resolve  : {
          features: GroupsService
      }
  }
];


@NgModule({
  declarations: [
    GroupsComponent,
    GroupsListComponent, 
    GroupsGroupFormDialogComponent, 
    SelectedBarComponent, 
    GroupsMainSidebarComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatChipsModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    ComponentsModule
],
providers      : [
      GroupsService,
      GroupsListComponent
  ],
  entryComponents: [
    GroupsGroupFormDialogComponent
  ]
})
export class GroupsModule { }
