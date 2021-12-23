import { NgModule } from '@angular/core';

import { AvatarViewerDialogComponent } from './avatar-viewer/avatar-viewer.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { FuseSharedModule } from '../../../@fuse/shared.module';
import { FuseConfirmDialogModule } from '../../../@fuse/components/confirm-dialog/confirm-dialog.module';
import { FuseSidebarModule } from '../../../@fuse/components/sidebar/sidebar.module';
import { UploadComponent } from './upload/upload.component';
import { ProgressComponent } from './progress/progress.component';
import { DndDirective } from '../directives/dnd.directive';
import { LoadingComponent } from './loading/loading.component';
import { DoneComponent } from './done/done.component';

import { CalendarComponent } from './calendar/calendar.component';
import { CalendarYearComponent } from './calendar/calendar-year/calendar-year.component';
import { CalendarMonthComponent } from './calendar/calendar-month/calendar-month.component';
import { CalendarDayComponent } from './calendar/calendar-day/calendar-day.component';


import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatProgressSpinnerModule } from '@angular/material';
import { DashTitleComponent } from './dash-title/dash-title.component';
import { DatosTablaComponent } from './datos-tabla/datos-tabla.component';

@NgModule({
  declarations: [AvatarViewerDialogComponent, UploadComponent, ProgressComponent, DndDirective, LoadingComponent, DoneComponent,
    CalendarComponent, CalendarYearComponent, CalendarMonthComponent, CalendarDayComponent, DashTitleComponent, DatosTablaComponent
  ],
  imports: [
    CommonModule,
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
    MatSelectModule,
    MatTreeModule,
    CdkTreeModule,
    MatProgressSpinnerModule
  ],
  exports: [
    AvatarViewerDialogComponent, UploadComponent, LoadingComponent, DoneComponent, CalendarComponent,
    CalendarYearComponent, CalendarMonthComponent, CalendarDayComponent, DashTitleComponent, DatosTablaComponent
  ],
  entryComponents: [
    AvatarViewerDialogComponent
  ]
})
export class ComponentsModule { }
