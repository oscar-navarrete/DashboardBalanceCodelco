import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from 'app/main/services/auth.service';
import { FeaturesService } from '../../features.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'features-main-sidebar',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class FeaturesMainSidebarComponent implements OnInit, OnDestroy
{
    feature: any;
    filterBy: string;
    systemFilterBy: string;
    searchInput: FormControl;
    recordGroups: any[] = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     */
    constructor(
        public _dataService: FeaturesService,
        private _auth: AuthService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.searchInput = new FormControl('');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.filterBy = this._dataService.filterBy || '';
        this.systemFilterBy = this._dataService.systemFilterBy || '';
        this.recordGroups = this._dataService.recordGroups;
        
        this.searchInput.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              distinctUntilChanged()
          )
          .subscribe((searchText: string) => {
              console.log(searchText);
              this.recordGroups = this._dataService.recordGroups.filter( _group => {
                  return _group.name.toLowerCase().includes(searchText.toLowerCase());
              });
          });
    
        this._dataService.onFeatureDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(feature => {
                this.feature = feature;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void
    {
        this.filterBy = filter;
        const filters = { filterBy: filter, systemFilterBy: this.systemFilterBy };
        this._dataService.getFeatures(filters);

    }

    changeSystemFilter(filter): void {
      this.systemFilterBy = filter;
      const filters = { filterBy: this.filterBy, systemFilterBy: filter };
      this._dataService.getFeatures(filters);
    }
}
