import { Injectable, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { environment } from 'environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'app/main/services/auth.service';
import { NotificatorService } from 'app/main/services/notificator.service';
import { Observable, Subscriber, Subject } from 'rxjs';
import { SocketService } from 'app/main/services/socket.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

@Injectable({providedIn: 'root'})

export class FunctionsService implements OnInit, OnDestroy {

  socketConnected = false;

  private _unsubscribeAll: Subject<any>;

  dialogRef: any;

  constructor(private _httpClient: HttpClient, 
              private _auth: AuthService, 
              private _notificator: NotificatorService, 
              private _socket: SocketService, 
              private _matDialog: MatDialog) { 
    this._unsubscribeAll = new Subject();

    this._socket.onSocketChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(conectado => {
      this.socketConnected = conectado;
    });
  }

  ngOnInit(): void {

  }
  
  exportExcel(arrayJson, _fileName, _sheetName): void
  {
    const fileName = _fileName + '.xlsx';
	   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arrayJson);
	   const wb: XLSX.WorkBook = XLSX.utils.book_new();
		  XLSX.utils.book_append_sheet(wb, ws, _sheetName);
		  XLSX.writeFile(wb, fileName);
  }



  parseFromExcel = (_number) => {
    if (_number === null || _number == ''){
      return 0;
    }
    // QUITAR LOS PUNTOS:
    // tslint:disable-next-line: variable-name
    let number = _number.toString().replace(new RegExp('.', 'g'), '');
    // REEMPLAZAR CAMAS POR PUNTO
    number = _number.toString().replace(new RegExp(',', 'g'), '.');
    return parseFloat(number);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  viewDate(date: Date): any {
    return moment(date).format('DD-MM-YYYY');
  }

  dateAdd(date: Date, interval: any, type: any): string {
    return moment(date).add(type, interval).format('DD-MM-YYYY');
  }

  keyEnterNext(event): void {
    const elementSource = event.target.name;
    let firstElement = '';
    let next = false;
    for (const element of event.target.form.elements) {
      if (firstElement === '') {
        firstElement = element.name;
      }
      if (next) {
        document.getElementById(element.name).focus();
        return;
      }
      if ( elementSource === element.name ) {
         next = true;
      }
    }
    document.getElementById(firstElement).focus();
  }

  post(url, body, _responseType?): Observable<any>
  {
    const headers         = new HttpHeaders({'auth-token': this._auth.token, 'system_id': environment.system_identifier});
    const textOptions     = {headers, responseType: 'text'};
    const normalOptions   = {headers};
    let options = normalOptions;

    if (_responseType !== undefined){
      if (_responseType === 'text'){
        options = textOptions;
      }
    }

    console.log('SERVER SEND:', body);
    return new Observable((observer: Subscriber<any>) => {
      if (this.socketConnected)
      {
        this._httpClient.post(environment.api_server + url, body, options).subscribe((response: any) => {
          console.log('SERVER RESPONSE:', response);
          if (response === null) {
            const _resp = {
              ok: false,
              message: 'No existe información'
              };
            observer.next(_resp);
            observer.complete();
          } else {
            if (response.ok === false){
              this._notificator.alert(response.message, '', 6000);
            }
            observer.next(response);
            observer.complete();
            }
        }, (error: any) => {
          // ERROR EN CONSULTA HTTP
          const newResponse = {ok: false, message: 'No se pudo procesar esta solicitud ya que el servidor devolvió el error ' + error.status + ': ' + error.statusText} ;
          // this._notificator.alert(newResponse.message, '', 6000);
          console.log(error);
          observer.next(newResponse);
          observer.complete();
        });
      }else{
        const newResponse = {ok: false, message: 'Socket no conectado'} ;
        this._notificator.alert(newResponse.message, '', 6000);
        console.log(newResponse.message);
        observer.next(newResponse);
        observer.complete();
      }
    });
  }  



  public notify(message, time): any {
    this._notificator.alert(message, '', time);
  }
  
  get(url, _responseType?): Observable<any>
  {
    const headers         = new HttpHeaders({'auth-token': this._auth.token, 'system_id': environment.system_identifier});
    const textOptions     = {headers, responseType: 'text'};
    const normalOptions   = {headers};
    let options = normalOptions;

    if (_responseType !== undefined){
      if (_responseType == 'text'){
        options = textOptions;
      }
    }

    console.log('SERVER SEND');

    return new Observable((observer: Subscriber<any>) => {
      if (this.socketConnected)
      {
        this._httpClient.get(environment.api_server + url, options).subscribe((response: any) => {
          // console.log("SERVER RESPONSE:",response);
          if (response.ok === false){
            this._notificator.alert(response.message, '', 6000);
          }
          observer.next(response);
          observer.complete();
        }, (error: any) => {
          // ERROR EN CONSULTA HTTP
          const newResponse = {ok: false, message: 'No se pudo procesar esta solicitud ya que el servidor devolvió el error ' + error.status + ': ' + error.statusText} ;
          // this._notificator.alert(newResponse.message, '', 6000);
          console.log(error);
          observer.next(newResponse);
          observer.complete();
        });
      }else{
        const newResponse = {ok: false, message: 'Socket no conectado'} ;
        this._notificator.alert(newResponse.message, '', 6000);
        console.log(newResponse.message);
        observer.next(newResponse);
        observer.complete();
      }
    });
  }  

}
