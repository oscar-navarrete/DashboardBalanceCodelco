import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogModule } from '../dialog/dialog.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatInputModule, MatSnackBar, MatSnackBarModule, MatBadgeModule } from '@angular/material';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseConfirmDialogModule } from '../../../../@fuse/components/confirm-dialog/confirm-dialog.module';
import { FuseSidebarModule } from '../../../../@fuse/components/sidebar/sidebar.module';
import { MyProfileFormDialogComponent } from '../../../main/apps/my-profile/my-profile.component';
import { AvatarViewerDialogComponent } from 'app/main/components/avatar-viewer/avatar-viewer.component';
import { DataService } from '../../../main/services/data.service';
import { ComponentsModule } from '../../../main/components/components.module';

@NgModule({
    declarations: [
        ToolbarComponent,
        MyProfileFormDialogComponent,
        // AvatarViewerDialogComponent
    ],
    entryComponents: [
        DialogComponent,
        MyProfileFormDialogComponent,
        // AvatarViewerDialogComponent
      ],
    
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatDialogModule,
        DialogModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
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
        MatSnackBarModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatBadgeModule,
        ComponentsModule
    ],
    exports     : [
        ToolbarComponent
    ],
    providers      : [
        DataService
    ]
})
export class ToolbarModule
{
}
