import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { UiService } from './ui.service';
import { AuthService } from './auth.service';
import { MessageNotification } from '../interfaces/interfaces';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment.prod';
import { NotificatorService } from 'app/main/services/notificator.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NotificationMessage } from '../models/security.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements OnInit, OnDestroy {

  notifications: MessageNotification[] = [];
  notifier = new Subject();

  notifiersFromServiceWorker = [];

  constructor(
              public ws: SocketService, 
              private ui: UiService, 
              public _auth: AuthService, 
              private _notificator: NotificatorService, 
              private _httpClient: HttpClient) {

      this.getPrivateMessage().pipe(
        takeUntil(this.notifier)
      ).subscribe(
        (notification: MessageNotification) => {
          //console.log("test");
          console.log(notification);
          notification.sender_read = false;
          if (environment.api_server.substr(environment.api_server.length - 1, 1).includes('/')) {
            // tslint:disable-next-line: max-line-length
            notification.sender_imageUrl = environment.api_server.substr(0, environment.api_server.length - 1 ) + notification.sender_imageUrl;
          } else {
            notification.sender_imageUrl = environment.api_server + notification.sender_imageUrl;
          }
          this.notifications.push(notification);
          this.notifications.sort((a: any, b: any) => {
            if (b.sender_datetime > a.sender_datetime) { return 1; }
            if (b.sender_datetime < a.sender_datetime) { return -1; }
            return 0;
          });
          this.play();
        }
      );
            
      this.notifications = [];
      this.getPendingMessages().pipe(takeUntil(this.notifier)).subscribe( (response: any) => {
        if (this.notifications.length === 0) {
          this.notifications = response;
        } else {
          this.updateMessagesList(response);
        }
      });

      this.getDeleteMessage().pipe(takeUntil(this.notifier)).subscribe( (response: any) => {
        console.log(response);
        this.deleteMessage(response.id);
      });
            
  }

  // tslint:disable-next-line: contextual-lifecycle
  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.unsubscribe();
    this.notifier.complete();
  }

  play(): void {
    const audio = new Audio('/assets/audio/notification.mp3');
    audio.play();
  }

  agreed(message): Promise<any> {
    return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'notificator/message/read';
      const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
      });
      const data = { message };
      for ( let i = 0; i < this.notifications.length; i++ )
      {
          if ( this.notifications[i].message_id === message )
          {
            this.notifications.splice(i, 1);
          }
      }
      this._httpClient.post(url, data, {headers})
          .subscribe((response: any) => {
            resolve(response);
          });
    });
  }


  deleteMessage(id: string): void {
    for ( let i = 0; i < this.notifications.length; i++ )
      {
          if ( this.notifications[i].message_id === id )
          {
            this.notifications.splice(i, 1);
          }
      }
  }

  updateMessagesList(messages: NotificationMessage[]) {
    if (messages.length > 0) {
      this.notifications = this.notifications.filter( (notif: any ) => {
        if ( messages.filter( (_m: any) => _m.message_id === notif.message_id).length > 0) {
            return true;
        }
        return false;
      });
    } else {
      this.notifications = [];
    }

  }

  getNoReadMessages() {
      const url: string = environment.api_server + 'notificator/message/all';
      const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
      });
      return this._httpClient.get(url, {headers});
  }

  getCountNotificationsFromServiceWorker() {
    return this.notifiersFromServiceWorker.length;
  }

  clearNotificationsFromServiceWorker() {
    this.notifiersFromServiceWorker = [];
  }

  sendMessage( mensaje: string ) {
    const payload = {
      from: this.ws.getUser().name,
      body: mensaje
    };
    this.ws.emit('message', payload);
  }

  getMessages() {
    return this.ws.listen('new-message');
  }

  public getPrivateMessage() {
    return this.ws.listen('private-message');
  }

  getConnectedUsers() {
    return this.ws.listen('connected-users');
  }

  getPendingMessages() {
    return this.ws.listen('pending-messages');
  }

  getDeleteMessage() {
    return this.ws.listen('delete-message');
  }

  emitActiveUsers() {
    return this.ws.emit('get-users');
  }

  public getPrivileges() {
    return this.ws.listen('privileges');
  }

}
