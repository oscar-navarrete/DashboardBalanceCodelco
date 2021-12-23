import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  constructor(private _httpClient: HttpClient, private _auth: AuthService) { 
    this._unsubscribeAll = new Subject();
  }

  getDataFromAPI(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'dash-all/get-data';
      const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
      });
      this._httpClient.post(url, body,  { headers }).pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
        console.log('response ===> ', response);

      resolve(response);
                    }, reject);
        }
    );
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
