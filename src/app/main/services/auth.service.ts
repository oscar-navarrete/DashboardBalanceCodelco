import { Options, Componente } from './../interfaces/interfaces';
import { environment } from './../../../environments/environment';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UiService } from './ui.service';
import { DataService } from './data.service';
import { Favorites, Features } from '../models/security.model';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  public token;
  public user: any = {};
  public userImageUrl = '';
  public rememberSession = false;
  public notificationsEnabled = false;
  public notificationSubscriptionHash: '';
  public appOptions: Options[] = [];
  notifier = new Subject();
  public isSocketConnected: boolean;
  public connectSubs: Subscription;
  public changePasswordRequired = false;
  favorites: Favorites[];
  features: Features[];
  @Output() menu = new EventEmitter<any>();



  constructor( private httpClient: HttpClient,
               private router: Router,
               private ds: DataService,
               public ws: SocketService,
               public ui: UiService
               ) { }
          

  login(data: { email: string, password: string}): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders(
        { 'system_id': environment.system_identifier,
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + window.btoa(`${data.email}:${data.password}`)        }
        );
      this.httpClient.post(`${environment.api_server }access/login`, data, { headers } ).subscribe( (response: any) => {
          resolve(response);
      }, reject);

    });
  }

  getAuthType() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders(
        { 'system_id': environment.system_identifier,
          'Content-Type': 'application/json'
        }
        );
      this.httpClient.get(`${environment.api_server }config/get-auth-type`, { headers } ).subscribe( (response: any) => {
          resolve(response);
      }, reject);

    });
  }

  async closeSession() {
    await localStorage.removeItem('remember-session');
    await localStorage.removeItem('authToken');
    this.token = '';
    this.rememberSession = false;
    this.ws.logoutWs();
  }

  changePwdReset(data: any, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'system_id': environment.system_identifier,
        'auth-reset-token': token
      });
      this.httpClient.post(`${environment.api_server }access/change-pwd-reset`, data, { headers } ).subscribe( (response: any) => {
          resolve(response);
      }, reject);

    });
  }

  changePwd(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'system_id': environment.system_identifier,
        'auth-token': this.token
      });
      this.httpClient.post(`${environment.api_server }access/change-pwd`, data, { headers } ).subscribe( (response: any) => {
          resolve(response);
      }, reject);

    });
  }

  resetPassword(data: { email: string, username: string}): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({ system_id: environment.system_identifier });
      this.httpClient.post(`${environment.api_server }access/reset-pwd`, data, { headers } ).subscribe( (response: any) => {
          resolve(response);
      }, reject);

    });
  }

  async saveToken(token: string, remember: boolean = true) {
    this.token = token;
    localStorage.setItem('authToken', this.token);
    if (remember) {
      this.saveRememberSession();
    }
  }

  async saveRememberSession() {
    this.rememberSession = true;
    await localStorage.setItem('remember-session', 'true');
  }

  async clearRememberSession() {
    this.rememberSession = false;
    await localStorage.setItem('remember-session', 'false');
  }

  getToken() {
    return new Promise( (resolve, reject) => {
      localStorage.get('authToken').then( async(token) => {
        this.token = await token;
        await resolve(token);
      });
    });
  }
  
  getNotificationsEnabled() {
    return new Promise( (resolve, reject) => {
      localStorage.get('notificationEnabled').then( async(notificationsEnabled) => {
        this.notificationsEnabled = await notificationsEnabled;
        await resolve(notificationsEnabled);
      });
    });
  }

  getNotificationSubscriptionHash() {
    return new Promise( (resolve, reject) => {
      localStorage.get('subscription').then( async(notificationSubscriptionHash) => {
        this.notificationSubscriptionHash = await notificationSubscriptionHash;
        await resolve(notificationSubscriptionHash);
      });
    });
  }

  getRememberSession() {
    return new Promise( (resolve, reject) => {
      localStorage.get('remember-session').then( (data) => {
        resolve(data);
      });
    });
  }

  private async loadStorage() {
    this.token = await localStorage.get('authToken') || this.token || null;
    this.rememberSession = await localStorage.get('remember-session') || this.rememberSession || false;
    this.notificationsEnabled = await localStorage.get('notificationEnabled') || this.notificationsEnabled || false;
    this.notificationSubscriptionHash = await localStorage.get('subscription') || this.notificationSubscriptionHash || '';
  }

  getMenuOpts() {
    return this.httpClient.get<Componente[]>('/assets/data/menu.json');
  }


  async loadToken() {
    this.token = await localStorage.getItem('authToken') || this.token || null;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  getToken2() {
    return new Promise<string>( async (resolve, reject) => {
      const token = await localStorage.getItem('authToken');
      resolve(token);
    });
    
  }

  async loadRememberSession() {
    return await localStorage.getItem('remember-session') || this.rememberSession || null;
  }

  async loadNotificationEnabled() {
    this.notificationsEnabled = localStorage.get('notificationEnabled') || this.notificationsEnabled || false;
  }


  async validateToken(): Promise<boolean> {
      try {
            this.token = '';
            await this.loadToken();
            if (this.token === null || undefined || '') {
              this.router.navigate(['/login'], { replaceUrl: true });
              return Promise.resolve(false);
            }

            this.ws.getPrivileges().pipe( takeUntil( this.notifier)).subscribe( (privileges: any) => {
              this.appOptions = privileges;
              this.ds.features = privileges;
              this.ds.getMainMenu(privileges);
            });


            // El getOptions debería llamar a otra ruta de la API para extrar el JSON formateado para esta App Angular
            // y registrar el menu como se hace en esta funcion  getMainMenu()
            this.ds.getOptions().then( ( obsData ) => {
              obsData.pipe(takeUntil(this.notifier)).subscribe( ( opts: any) => {
                this.ds.features = opts.data;
                this.appOptions = opts.data;
                this.ds.getMainMenu(opts);
              });
            });

            const url: string = environment.api_server + 'user';
            return new Promise<boolean>( resolve => {
              const headers = new HttpHeaders({
                'auth-token': this.token,
                'system_id': environment.system_identifier
              });
              this.httpClient.get(url, { headers }).subscribe( async (response: any) => {
                if (response.ok === true) {
                  this.user = response.data.response;
                  this.userImageUrl = this.user.avatar;
                  resolve(true);
                } else {
                  // await localStorage.removeItem('authToken');
                  this.router.navigate(['/login'], { replaceUrl: true });
                  resolve(false);
                }
              });
            });
      } catch (error) {
        this.router.navigate(['/home'], { replaceUrl: true });
        return Promise.resolve(false);
      }
  }


  async validateResetToken(token: string): Promise<boolean> {

    const url: string = environment.api_server + 'access/change-pwd-reset';

    return new Promise<boolean>( resolve => {
      const headers = new HttpHeaders({
        'auth-reset-token': token,
        'system_id': environment.system_identifier
      });

      this.httpClient.get(url, { headers }).subscribe( async (response: any) => {
        console.log(response);
        if (response.ok === true) {
          this.user = response.data.response;
          if (environment.api_server.substr(environment.api_server.length - 1, 1).includes('/')) {
            this.userImageUrl = environment.api_server.substr(0, environment.api_server.length - 1 ) + this.user.user_avatar;
          } else {
            this.userImageUrl = environment.api_server + this.user.user_avatar;
          }
          resolve(true);
        } else {

          await localStorage.removeItem('authToken');

          // this.router.navigate(['/login'], { replaceUrl: true });

          resolve(false);
        }
      });
    });
  }
  
  getFavorites(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'user/favorites';
      const headers = new HttpHeaders({
            'auth-token': this.token,
            'system_id': environment.system_identifier
      });
      this.httpClient.get(url, { headers }).subscribe((response: any) => {
      this.favorites = response.data;
      resolve(this.favorites);
                    }, reject);
        }
    );
  }  

  getFeatures(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'user/features';
      const headers = new HttpHeaders({
            'auth-token': this.token,
            'system_id': environment.system_identifier
      });
      this.httpClient.get(url, { headers }).subscribe((response: any) => {
      this.features = response.data;
      console.log(this.features);
      resolve(this.features);
                    }, reject);
        }
    );
  }  

  


  callCloseSession() {
    this.callCloseSessionConfirm();
  }

  async callCloseSessionConfirm() {
 
  }


}
