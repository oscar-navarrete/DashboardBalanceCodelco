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
import { FeaturesComponent } from './features.component';
import { FeaturesService } from './features.service';
import { FeatureListComponent } from './feature-list/feature-list.component';
import { FeaturesFeatureFormDialogComponent } from './feature-form/feature-form.component';
import { SelectedBarComponent } from './selected-bar/selected-bar.component';
import { FeaturesMainSidebarComponent } from './sidebars/main/main.component';
import { MatChipsModule } from '@angular/material/chips';

const routes: Routes = [
  {
      path     : '**',
      component: FeaturesComponent,
      resolve  : {
          features: FeaturesService
      }
  }
];

@NgModule({
  declarations: [
    FeaturesComponent,
    FeatureListComponent,
    FeaturesFeatureFormDialogComponent,
    SelectedBarComponent,
    FeaturesMainSidebarComponent,
  ],
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
        FuseSidebarModule
  ],
  providers      : [
        FeaturesService,
        FeatureListComponent
    ],
    entryComponents: [
      FeaturesFeatureFormDialogComponent
    ]
})
export class FeaturesModule { }
