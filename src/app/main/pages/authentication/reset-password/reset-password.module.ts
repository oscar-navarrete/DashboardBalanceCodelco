import { NgModule } from '@angular/core';
import { ResetPasswordComponent } from './reset-password.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';
import { SecurityGuard } from 'app/main/guards/security.guard';

const routes = [
  {
      path     : 'auth/reset-password',
      component: ResetPasswordComponent,
      canLoad: [SecurityGuard],
  }
];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    RouterModule.forChild( routes ),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FuseSharedModule
  ]
})


export class ResetPasswordModule { }
