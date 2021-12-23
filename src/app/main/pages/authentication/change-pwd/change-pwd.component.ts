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


@Component({
  selector     : 'change-pwd',
  templateUrl  : './change-pwd.component.html',
  styleUrls    : ['./change-pwd.component.scss'],
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
export class ChangePwdComponent implements OnInit {

  resetPasswordForm: FormGroup;
  token = '';
  sending =  false;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
      private _fuseConfigService: FuseConfigService,
      private _formBuilder: FormBuilder,
      public activatedRoute: ActivatedRoute,
      public _authService: AuthService,
      private _notificator: NotificatorService,
      private _router: Router,
      private _snackBar: MatSnackBar
  )
  {
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
        console.log(this.token);
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

      this._authService.validateResetToken(this.token).then( (data) => {
        if (!data) {
                this._notificator.alert('Imposible validar el usuario. El token especificado no es válido!!', 'Cerrar', 10000);
                this._router.navigateByUrl('/pages/auth/login');
                return;
            }
      });          
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
      username: this._authService.user.user_username,
      email: this._authService.user.user_email,
      oldPassword: '',
      newPassword: this.resetPasswordForm.value.password
    };
    this._authService.changePwdReset(data, this.token)
    .then( async (response: any ) => {
        if (!response.ok) {
          this._notificator.alert(response.message, 'Cerrar', 10000);

          this.sending = false;
        //   this.buttonTitle = 'Enviar';
          return;
        }
        const serverResponse = response.data.response;
        if ( !serverResponse.ok ) {
            this._notificator.alert(serverResponse.message, 'Cerrar', 10000);
          this.sending = false;
        //   this.buttonTitle = 'Enviar';
          return;
        }
        setTimeout(() => {
            this._notificator.alert('La contraseña ha sido cambiada exitosamente.', 'Cerrar', 5000);
            this._router.navigateByUrl('/pages/auth/login');
        }, 2000);
      })
    .catch( (error) => {
        this._notificator.alert(error.message, 'Cerrar', 10000);
        this.sending = false;
    //   this.buttonTitle = 'Enviar';
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
