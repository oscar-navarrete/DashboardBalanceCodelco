import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/main/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
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
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    disabledSend = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
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
    }

    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', Validators.required]
        });
    }

    reset(): void {
      this.disabledSend = true;
      const data = {
          email: this.forgotPasswordForm.controls.email.value,
          username: this.forgotPasswordForm.controls.username.value
      };

      this._authService.resetPassword(data)
      .then( (dataReset: any) => {
        if (!dataReset.ok) {
          this.openSnackBar(dataReset.message, 'Cerrar');
         } else {
            this.openSnackBar(dataReset.message, 'Cerrar');
            this._router.navigateByUrl('/pages/auth/login');
         }
      })
      .catch( (error: any) => {
        this.openSnackBar(error, '');
      })
      .finally( () => {
        this.disabledSend = false;
      });
    }

    openSnackBar(message: string, action: string): void {
      this._snackBar.open(message, action, {
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: 'notif-success'
      });
    }
}


