import { NgModule } from '@angular/core';
import { LoginModule } from 'app/main/pages/authentication/login/login.module';
import { ForgotPasswordModule } from 'app/main/pages/authentication/forgot-password/forgot-password.module';
import { ChangePwdModule } from './authentication/change-pwd/change-pwd.module';
import { NotificatorService } from 'app/main/services/notificator.service';
import { HomeComponent } from './home/home.component';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';

@NgModule({
  imports: [
    LoginModule,
    ForgotPasswordModule,
    ChangePwdModule,
    ResetPasswordModule
  ],
  providers: [
    NotificatorService
  ],
  declarations: [HomeComponent]
})
export class PagesModule { }
