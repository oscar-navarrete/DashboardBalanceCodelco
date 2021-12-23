import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { FuseUtils } from '@fuse/utils';
// import { FeatureGroup, Feature } from 'app/main/models/security.model';
import { AuthService } from 'app/main/services/auth.service';
import { System, UserGroup, Feature, User } from '../../../models/security.model';
import { takeUntil } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GroupsService implements Resolve<any>, OnDestroy  {

  onGroupsChanged: BehaviorSubject<any>;
  onSelectedGroupsChanged: BehaviorSubject<any>;
  onGroupDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  records: UserGroup[];

  recordMembers: User[];
  recordUsers: User[];
  recordSystem: System[];
  record: any;
  
  selectedRecords: string[] = [];
  
  userConnected: any;

  filterBy: string;
  systemFilterBy: string;
  searchText: string;

  private _unsubscribeAll: Subject<any>;
  
  constructor(private _httpClient: HttpClient, private _auth: AuthService) { 
    // Set the defaults
    this.onGroupsChanged = new BehaviorSubject([]);
    this.onSelectedGroupsChanged = new BehaviorSubject([]);
    this.onGroupDataChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();
    this.userConnected = this._auth.user;
    this._unsubscribeAll = new Subject();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getGroups(),
                this.getMembers(),
                // this.getFeatureData(),
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(searchText => {
                        this.searchText = searchText;
                        this.getGroups();
                    });

                    this.onFilterChanged
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(filter => {
                        this.getGroups({ filterBy: filter.filterBy });
                    });

                    resolve();

                },
                reject
            );
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    search(searchText: string): void {
        this.searchText = searchText;
        this.getGroups();
    }

    getGroups(data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (data) {
                this.filterBy = data.filterBy;  
            }
            const url: string = environment.api_server + 'roles/list-all';
            const headers = new HttpHeaders({
              'auth-token': this._auth.token,
              'system_id': environment.system_identifier
            });
            this._httpClient.get(url, { headers }).subscribe((response: any) => {
            this.records = response.data;
            this.filterBy = this.filterBy || 'active';
            if ( this.filterBy !== '') {
            if (this.filterBy === 'active') {
                this.records = this.records.filter( (_item: any) => {
                    return _item.enabled === true;
                });
    
            } else if (this.filterBy === 'disabled') {
                this.records = this.records.filter( (_item: any) => {
                    return _item.enabled === false;
                });
    
            } else {
                this.records = this.records.filter( (_item: any) => {
                    return _item.groups.includes(this.filterBy);
                });
            }
        }

            if ( this.searchText && this.searchText !== '' ) {
            this.records = FuseUtils.filterArrayByString(this.records, this.searchText);
        }

            this.records = this.records.map((_item: any) => {
                            return new UserGroup(_item);
                        });

            this.onGroupsChanged.next(this.records);

            resolve(this.records);
                      }, reject);
          }
      );
  }

  getMembers(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'user/list-all';
      const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
      });
      this._httpClient.get(url, { headers }).subscribe((response: any) => {
      this.recordMembers = response.data;
      resolve(this.recordMembers);
                    }, reject);
        }
    );
}
  
  toggleSelectedRecord(id): void
  {
      // First, check if we already have that contact as selected...
      if ( this.selectedRecords.length > 0 )
      {
          const index = this.selectedRecords.indexOf(id);

          if ( index !== -1 )
          {
              this.selectedRecords.splice(index, 1);

              // Trigger the next event
              this.onSelectedGroupsChanged.next(this.selectedRecords);

              // Return
              return;
          }
      }

      // If we don't have it, push as selected
      this.selectedRecords.push(id);

      // Trigger the next event
      this.onSelectedGroupsChanged.next(this.selectedRecords);
  }


  toggleSelectAll(): void
  {
      if ( this.selectedRecords.length > 0 )
      {
          this.deselectRecords();
      }
      else
      {
          this.selectRecords();
      }
  }

  selectRecords(filterParameter?, filterValue?): void
  {
      this.selectedRecords = [];

      // If there is no filter, select all contacts
      if ( filterParameter === undefined || filterValue === undefined )
      {
          this.selectedRecords = [];
          this.records.map(record => {
              this.selectedRecords.push(record.id);
          });
      }

      // Trigger the next event
      this.onSelectedGroupsChanged.next(this.selectedRecords);
  }

  updateRecord(mode, record): Promise<any>
  {
      return new Promise((resolve, reject) => {
          let url: string = environment.api_server + 'security-groups/create';
          if (mode === 'edit') {
              url = environment.api_server + 'security-groups/update';
          }
          const headers = new HttpHeaders({
                'auth-token': this._auth.token,
                'system_id': environment.system_identifier
          });

          this._httpClient.post(url, {...record}, {headers})
              .subscribe(response => {
                  this.getGroups();
                  resolve(response);
              });
      });
  }

  deselectRecords(): void
  {
      this.selectedRecords = [];

      // Trigger the next event
      this.onSelectedGroupsChanged.next(this.selectedRecords);
  }

  deleteRecord(record, refresh = true): Promise<any>
  {
      return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'security-groups/delete';
      const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
      });

      this._httpClient.post(url, {...record}, {headers})
          .subscribe(response => {
              if (refresh) {
                this.getGroups();
              }
              resolve(response);
          });
      });
  }

  enableDisable(enabled: boolean, record): Promise<any>
  {
      return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'security-groups/enable-disable';
      const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
      });
      record.enabled = enabled;

      this._httpClient.post(url, {...record}, {headers})
          .subscribe(response => {
              this.getGroups();
              resolve(response);
          });
      });
  }


  actionGroup(data): Promise<any> {
      return new Promise((resolve, reject) => {
          let url: string = environment.api_server + 'permissions/add-user-rol';
          if (!data.checked) {
              url = environment.api_server + 'permissions/delete-user-rol';
          }
          const headers = new HttpHeaders({
                'auth-token': this._auth.token,
                'system_id': environment.system_identifier
          });
          this._httpClient.post(url, {...data}, {headers})
              .subscribe((response: any) => {
                  if (response.ok) {
                      if (response.data.ok) {
                          this.records.find( _record => _record.id === data.group).users = response.data.users;
                      }
                  }
                  resolve(response);
              });
          });
  }

  deleteSelectedRecords(): void
  {
      for ( const recordId of this.selectedRecords )
      {
          const record = this.records.find( _record => {
              return _record.id === recordId;
          });
          this.deleteRecord(record, false);
      }
    //   this.onGroupsChanged.next(this.records);
      this.getGroups();
      this.deselectRecords();
  }


}
