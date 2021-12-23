import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GroupsService } from '../../groups.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'groups-main-sidebar',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class GroupsMainSidebarComponent implements OnInit, OnDestroy
{
    group: any;
    filterBy: string;
    systemFilterBy: string;
    searchInput: FormControl;
    recordMembers: any[] = [];

    // Private
    private _unsubscribeAll: Subject<any>;

   
    constructor(
        public _dataService: GroupsService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.searchInput = new FormControl('');
    }

    ngOnInit(): void
    {
        this.filterBy = this._dataService.filterBy || '';
        this.recordMembers = this._dataService.recordMembers;
        
        this.searchInput.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              distinctUntilChanged()
          )
          .subscribe((searchText: string) => {
              console.log(searchText);
              this.recordMembers = this._dataService.recordMembers.filter( _group => {
                  return _group.name.toLowerCase().includes(searchText.toLowerCase());
              });
          });
    
        this._dataService.onGroupsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(group => {
                this.group = group;
            });
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    changeFilter(filter): void
    {
        this.filterBy = filter;
        const filters = { filterBy: filter };
        this._dataService.getGroups(filters);
    }
}
