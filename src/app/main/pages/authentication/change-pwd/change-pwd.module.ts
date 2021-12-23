import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { ChangePwdComponent } from './change-pwd.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
      path     : 'auth/change-pwd/:token',
      component: ChangePwdComponent
  }
];

@NgModule({
  declarations: [ChangePwdComponent],
  imports: [
    RouterModule.forChild( routes ),
    MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
  ]
})
export class ChangePwdModule { }
