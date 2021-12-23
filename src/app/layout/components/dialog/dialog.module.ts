import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FuseSharedModule } from '@fuse/shared.module';
import { DialogComponent } from './dialog.component';



@NgModule({
  declarations: [
    DialogComponent
  ],
  imports     : [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MatRippleModule,
    

    FuseSharedModule
  ],
  exports     : [
    DialogComponent
  ]
})
export class DialogModule { }
