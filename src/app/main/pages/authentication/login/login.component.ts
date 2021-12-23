import { SocketService } from './../../../services/socket.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/main/services/auth.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificatorService } from 'app/main/services/notificator.service';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy
{
    loginForm: FormGroup;
    sending = false;
    viewLogin = false;
    rememberPassword = true;
    authType = '';
    

    private isConnect: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;


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
        private _notificator: NotificatorService,
        private ws: SocketService,
        private router: Router
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
        this._authService.getAuthType().then( (response: any) => {
            if (response.type) {
                this.authType = response.type;
            }
        });
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required ]],
            password: ['', Validators.required],
            remember: [ this.rememberPassword ]
        });

        this._authService.loadRememberSession().then( async(remember) => {
            if (remember) {

                this._authService.loadToken().then( () => {
                    if (this._authService.token !== undefined) {
                        this.router.navigate(['/apps/dashboards/main'], { replaceUrl: true });
                    }
                });
            } else {
                this.viewLogin = true;
            }
          });
          
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
    }

    remember(isChecked): void {
        this.rememberPassword = isChecked;
    }

    login(): void {
        this.sending = true;
        const data = {
            email: this.loginForm.controls.email.value,
            password: this.loginForm.controls.password.value
        };

        this._authService.login(data)
        .then( async (response: any ) => {

            if (!response.ok) {
                this._notificator.alert(response.message, 'Cerrar', 5000);
                this.sending = false;
                return;
            }
            const serverResponse = response.data.response;
            console.log(serverResponse);
            let token;
            if ( !serverResponse.ok ) {
                if (serverResponse.changePassword) {
                    token = response.data.security.appToken;
                    await this._authService.saveToken(token, true || false);
                    this.ws.loginWs( response.data.response.user_id, response.data.response.login_id ).then( async () => {
                        this._authService.changePasswordRequired = true;
                        await this._authService.validateToken();
                        await this.router.navigate(['/pages/auth/reset-password/'], { replaceUrl: true });
                    });
                    return;
                } else {
                    this._notificator.alert(serverResponse.message, 'Cerrar', 5000);
                    this.sending = false;
                    return;
                }
            }

            // Guardar en el Storage
            token = response.data.security.appToken;
            await this._authService.saveToken(token, this.rememberPassword);
            this.ws.loginWs( serverResponse.user_id, serverResponse.login_id ).then( () => {
                this.router.navigate(['/apps/dashboards/main'], { replaceUrl: true });
            });    
        })
        .catch( (error: any) => {
            if (error.error) {
                this._notificator.alert(`Error ${ error.status }: ${ error.statusText }. ${ error.error.message }` , 'Cerrar', 5000);
            } else {
                this._notificator.alert(`Error ${ error.status }: ${ error.statusText }.` , 'Cerrar', 5000);
            }
            this.sending = false;
        });
    }
}
