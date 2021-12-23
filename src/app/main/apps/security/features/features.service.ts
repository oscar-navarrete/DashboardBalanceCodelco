import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { FuseUtils } from '@fuse/utils';
import { FeatureGroup, Feature } from 'app/main/models/security.model';
import { AuthService } from 'app/main/services/auth.service';
import { System } from '../../../models/security.model';


@Injectable({
  providedIn: 'root'
})
export class FeaturesService implements Resolve<any> {

  onFeaturesChanged: BehaviorSubject<any>;
  onSelectedFeaturesChanged: BehaviorSubject<any>;
  onFeatureDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  records: Feature[];
  recordGroups: FeatureGroup[];
  recordSystem: System[];
  record: any;
  selectedRecords: string[] = [];
  
  userConnected: any;

  filterBy: string;
  systemFilterBy: string;
  searchText: string;

  constructor(private _httpClient: HttpClient, private _auth: AuthService)  {
    // Set the defaults
    this.onFeaturesChanged = new BehaviorSubject([]);
    this.onSelectedFeaturesChanged = new BehaviorSubject([]);
    this.onFeatureDataChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();
    this.userConnected = this._auth.user;
}
    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        
        return new Promise((resolve, reject) => {

            Promise.all([
                // this.getGroups(),
                this.getFeatures(),
                this.getFeatureData(),
            ]).then(
                ([files]) => {

                    // if (this.recordSystem.length > 0) {
                    //     this.systemFilterBy = this.recordSystem[0].id;
                    // }
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getFeatures();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter.filterBy;
                        this.systemFilterBy = filter.systemFilterBy;
                        this.getFeatures();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getGroups(): Promise<any> {
      return new Promise((resolve, reject) => {
        const url: string = environment.api_server + 'roles/list-all';
        const headers = new HttpHeaders({
              'auth-token': this._auth.token,
              'system_id': environment.system_identifier
        });
        this._httpClient.get(url, { headers }).subscribe((response: any) => {
        this.recordGroups = response.data;
        resolve(this.recordGroups);
                      }, reject);
          }
      );
  }

  getSystems(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url: string = environment.api_server + 'security-features/system-all';
      const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
      });
      this._httpClient.get(url, { headers }).subscribe((response: any) => {
      this.recordSystem = response.data;
      resolve(this.recordSystem);
                    }, reject);
        }
    );
}

    search(searchText: string): void {
        this.searchText = searchText;
        this.getFeatures();
    }
    
  getFeatures(data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        if (data) {
            this.filterBy = data.filterBy; 
            this.systemFilterBy  = data.systemFilterBy;
        }
        const url: string = environment.api_server + 'security-features/list-all';
        const headers = new HttpHeaders({
            'auth-token': this._auth.token,
            'system_id': environment.system_identifier
        });
        this._httpClient.get(url, { headers }).subscribe( async (response: any) => {
      this.records = response.data;
      if (this.systemFilterBy === undefined) {
        await this.getGroups();
        await this.getSystems().then( () => {
            this.systemFilterBy = this.recordSystem[0].id;
        });
      }
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
      if ( this.systemFilterBy !== '') {
           this.records = this.records.filter( (_item: any) => {
                return _item.system === this.systemFilterBy;
            });
      }
      if ( this.searchText && this.searchText !== '' ) {
            this.records = FuseUtils.filterArrayByString(this.records, this.searchText);
      }
      this.records = this.records.map((_item: any) => {
                            return new Feature(_item);
                        });
      this.onFeaturesChanged.next(this.records);
      resolve(this.records);
                    }, reject);
        }
    );
  }

  getFeatureData(): Promise<any>
  {
      return new Promise((resolve, reject) => {
          const url: string = environment.api_server + 'security-features/BF2D13B9-BEF9-4801-B7BE-EB34729D5A64';
          const headers = new HttpHeaders({
                'auth-token': this._auth.token,
                'system_id': environment.system_identifier
          });
          this._httpClient.get(url, { headers }).subscribe((response: any) => {
                      this.record = response.data.response;
                      this.onFeatureDataChanged.next(this.record);
                      resolve(this.record);
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
                this.onSelectedFeaturesChanged.next(this.selectedRecords);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedRecords.push(id);
        console.log(this.selectedRecords);

        // Trigger the next event
        this.onSelectedFeaturesChanged.next(this.selectedRecords);
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
        this.onSelectedFeaturesChanged.next(this.selectedRecords);
    }

    updateRecord(mode, record): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let url: string = environment.api_server + 'security-features/create';
            if (mode === 'edit') {
                url = environment.api_server + 'security-features/update';
            }
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });

            this._httpClient.post(url, {...record}, {headers})
                .subscribe(response => {
                    this.getFeatures();
                    resolve(response);
                });
        });
    }

    deselectRecords(): void
    {
        this.selectedRecords = [];

        // Trigger the next event
        this.onSelectedFeaturesChanged.next(this.selectedRecords);
    }

    deleteRecord(record): Promise<any>
    {
        return new Promise((resolve, reject) => {
        const url: string = environment.api_server + 'security-features/delete';
        const headers = new HttpHeaders({
              'auth-token': this._auth.token,
              'system_id': environment.system_identifier
        });

        this._httpClient.post(url, {...record}, {headers})
            .subscribe(response => {
                this.getFeatures();
                resolve(response);
            });
        });
    }

    enableDisable(enabled: boolean, record): Promise<any>
    {
        return new Promise((resolve, reject) => {
        const url: string = environment.api_server + 'security-features/enable-disable';
        const headers = new HttpHeaders({
              'auth-token': this._auth.token,
              'system_id': environment.system_identifier
        });
        record.enabled = enabled;

        this._httpClient.post(url, {...record}, {headers})
            .subscribe(response => {
                this.getFeatures();
                resolve(response);
            });
        });
    }


    actionGroup(data): Promise<any> {
        return new Promise((resolve, reject) => {
            let url: string = environment.api_server + 'permissions/add-feature-rol';
            if (!data.checked) {
                url = environment.api_server + 'permissions/delete-feature-rol';
            }
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });
            this._httpClient.post(url, {...data}, {headers})
                .subscribe((response: any) => {
                    if (response.ok) {
                        if (response.data.ok) {
                            this.records.find( _record => _record.id === data.feature).groups = response.data.groups;
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
            const recordIndex = this.records.indexOf(record);
            this.records.splice(recordIndex, 1);
        }
        this.onFeaturesChanged.next(this.records);
        this.deselectRecords();
    }


}
