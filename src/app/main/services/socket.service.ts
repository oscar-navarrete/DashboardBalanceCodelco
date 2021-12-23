import { UserSocket } from './../classes/user';
import { Injectable, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { UiService } from './ui.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit, OnDestroy {

  public socketStatus = false;
  @Output() conectado = new EventEmitter<boolean>();
  notifier = new Subject();
  public user: UserSocket = null;
  onSocketChanged: BehaviorSubject<boolean>;

  constructor(private socket: Socket, 
              private router: Router,
              private ui: UiService) {
    this.checkStatus();
    this.onSocketChanged = new BehaviorSubject(false);
  }

  // tslint:disable-next-line: contextual-lifecycle
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.unsubscribe();
  }

  checkStatus(): void {
    this.socket.on('connect', () => {
      this.socketStatus = true;
      this.conectado.emit(true);
      this.onSocketChanged.next(true);
      this.loadStorage();
    });

    this.socket.on('disconnect', () => {
      this.conectado.emit(false);
      this.onSocketChanged.next(false);
      this.socketStatus = false;
    });
  }

  emit( evento: string, payload?: any, callback?: (Function)): void {
    this.socket.emit( evento, payload, callback );
  }

  listen(evento: string) {
    return this.socket.fromEvent( evento );
  }

  async saveStorage() {
    await localStorage.setItem('user', JSON.stringify( this.user));
    this.user = await JSON.parse(localStorage.getItem('user'));
    
  }

  loadStorage(): void {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      console.log(this.user);
      this.loginWs( this.user.name, this.user.login || '' );
    }
  }

  loginWs( name: string, login?: string ): Promise<any> {
    console.log(name, login);
    return new Promise( ( resolve, reject) => {
      this.emit('configure-name', { name, login }, resp => {
        this.user = new UserSocket( name, login );
        this.saveStorage();
        resolve();
      });
    });
  }

  getPendingMessages() {
    return this.listen('pending-messages');
  }

  getDeleteMessage() {
    return this.listen('delete-message');
  }

  logoutWs(): void {
    this.user = null;
    localStorage.removeItem('user');
    const payload = {
      name: 'no-name',
      login: ''
    };
    console.log(payload);
    this.emit('configure-name', payload, () => { });
    this.ui.redirectTo('/login');
  }

  getUser(): any {
    return this.user;
  }

  public getPrivileges() {
    return this.listen('privileges');
  }


}
