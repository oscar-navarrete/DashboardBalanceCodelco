import { environment } from './../../../environments/environment';
import { Injectable, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { navigation } from 'app/navigation/navigation';
import { FuseNavigationService } from '../../../@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '../../../@fuse/types/fuse-navigation';
import { Features } from '../models/security.model';
import { FuseNavigationItem } from '@fuse/types';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit, OnDestroy {

  notifier = new Subject();
  customNavigation: FuseNavigation[];
  features: FuseNavigationItem[];
  onMenuChanged: BehaviorSubject<any>;
  @Output() menu = new EventEmitter<any>();

  constructor(private http: HttpClient,
              private _fuseNavigationService: FuseNavigationService) {
        this.onMenuChanged = new BehaviorSubject([]);
  }

  async generateHeaders() {
    const token = await localStorage.getItem('authToken') || '';
    return new HttpHeaders({
      'auth-token': token,
      'system_id' : environment.system_identifier
    });
  }

  
  // tslint:disable-next-line: contextual-lifecycle
  ngOnInit(): void {
    console.log('hola');
    this.get(environment.api_server + 'user/features').then( (menu: any) => {
      console.log('menu', menu);
      this.customNavigation = [ {
        id       : 'systemMnu',
        title    : 'Menú del Sistema',
        type     : 'collapsable',
        children : menu.data
      }];
    });
  }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.unsubscribe();
  }

  async get(url: string) {
    const headers = await this.generateHeaders();
    return this.http.get(url, { headers });
  }

   getOptions(): any {
    return this.get(environment.api_server + 'user/features');
  }



  async getJSONMenu() {
    
    return this.customNavigation || [];

  }

  getMainMenu(_navigation) {
    this.customNavigation = [ {
        id       : 'systemMnu',
        title    : 'Menú del Sistema',
        type     : 'collapsable',
        children : this.features
      }];
    this.menu.emit(_navigation);
    // this.menu.emit(this.customNavigation);
    // const nav = this.customNavigation;
    const nav = _navigation;
    
    this._fuseNavigationService.unregister('main');
    this._fuseNavigationService.register('main', nav);
    this._fuseNavigationService.setCurrentNavigation('main');
  }

}
