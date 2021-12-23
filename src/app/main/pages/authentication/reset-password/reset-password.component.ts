import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/main/services/auth.service';
import { NotificatorService } from 'app/main/services/notificator.service';
import { MatSnackBar } from '@angular/material';
import { SocketService } from '../../../services/socket.service';


@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
  styles: [`
  ::ng-deep .mat-snack-bar-container{
    color: #155724 !important;
    background-color: #d4edda !important;
    border-color: #c3e6cb !important;
  }
  ::ng-deep .mat-simple-snackbar-action {
    color: red;
  }
`]
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  token = '';
  sending =  false;
  changePasswordRequired = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
      private _fuseConfigService: FuseConfigService,
      private _formBuilder: FormBuilder,
      public activatedRoute: ActivatedRoute,
      public _authService: AuthService,
      private _notificator: NotificatorService,
      private _router: Router,
      private ws: SocketService
  )
  {
      this.changePasswordRequired = this._authService.changePasswordRequired;
      // Configure the layout
      this._fuseConfigService.config = {
          layout: {
              navbar   : {
                  hidden: true
              },
              toolbar  : {
                  hidden: true
              },
              footer   : {
                  hidden: true
              },
              sidepanel: {
                  hidden: true
              }
          }
      };

      // Set the private defaults
      this._unsubscribeAll = new Subject();

      this.activatedRoute.params.subscribe((params) => {
        this.token = params.token || '';
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      this.resetPasswordForm = this._formBuilder.group({
          actualPassword : ['', Validators.required],
          password       : ['', Validators.required],
          passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
      });

      // Update the validity of the 'passwordConfirm' field
      // when the 'password' field changes
      this.resetPasswordForm.get('password').valueChanges
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
              this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
          });

      this.token = this._authService.token || '';    

      if (this.token === '') {
            this._notificator.alert('Imposible validar el usuario. El token especificado no es válido!!', 'Cerrar', 10000);
            this._router.navigateByUrl('/pages/auth/login');
            return;
      }

       
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  onChange(): void {
    this.sending = true;
    // this.buttonTitle = 'Enviando...';

    const data = {
      username: this._authService.user.username,
      email: this._authService.user.email,
      oldPassword: this.resetPasswordForm.value.actualPassword,
      newPassword: this.resetPasswordForm.value.password
    };
    this._authService.changePwd(data)
    .then( async (response: any ) => {
        if (!response.ok) {
          this._notificator.alert(response.message, 'Cerrar', 10000);
          this.sending = false;
          return;
        }
        const serverResponse = response.data.response;
        if ( !serverResponse.ok ) {
            this._notificator.alert(serverResponse.message, 'Cerrar', 10000);
            this.sending = false;
            return;
        }
        setTimeout( async() => {
            this._notificator.alert('La contraseña ha sido cambiada exitosamente.', 'Cerrar', 5000);
            const token = response.data.security.appToken;
            await this._authService.saveToken(token, true || false);
            this.ws.loginWs( response.data.response.user_id, response.data.response.login_id ).then( () => {
            this._router.navigateByUrl('/apps/dashboards/main');
         });
            
        }, 2000);
      })
    .catch( (error) => {
        this._notificator.alert(error.message, 'Cerrar', 10000);
        this.sending = false;
    });

  }

}




export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if ( !control.parent || !control )
  {
      return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if ( !password || !passwordConfirm )
  {
      return null;
  }

  if ( passwordConfirm.value === '' )
  {
      return null;
  }

  if ( password.value === passwordConfirm.value )
  {
      return null;
  }

  return {passwordsNotMatching: true};
};
