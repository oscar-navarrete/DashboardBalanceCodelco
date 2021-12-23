import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { GroupsService } from '../groups.service';
import { GroupsGroupFormDialogComponent } from '../groups-form/groups-form.component';


@Component({
  selector: 'groups-group-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class GroupsListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent', {static: false})
    dialogContent: TemplateRef<any>;

    records: any;
    record: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name', 'description', 'members', 'buttons'];
    selectedRecords: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    searchInput: FormControl;

    recordMembers: any[] = [];

    recordMembersForAvatars: any[] = [];

    countAvatars = 0;

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
      public _dataService: GroupsService,
      public _matDialog: MatDialog
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.searchInput = new FormControl('');
  }

  ngOnInit(): void
  {
      this.dataSource = new FilesDataSource(this._dataService);

      this.recordMembers = this._dataService.recordMembers;
      this.recordMembersForAvatars = this._dataService.recordMembers;

      this.searchInput.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              distinctUntilChanged()
          )
          .subscribe((searchText: string) => {
              this.recordMembers = this._dataService.recordMembers
                  .filter( _member => {
                      const fullName = _member.name + ' ' + _member.lastName;
                      return fullName.toLowerCase().includes(searchText.toLowerCase());
              });
          });


      this._dataService.onGroupsChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe( _records => {
              this.records = _records;

              this.checkboxes = {};
              _records.map( _record => {
                  this.checkboxes[_record.id] = false;
              });
          });

      this._dataService.onSelectedGroupsChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(selectedRecords => {
              for ( const id in this.checkboxes )
              {
                  if ( !this.checkboxes.hasOwnProperty(id) )
                  {
                      continue;
                  }

                  this.checkboxes[id] = selectedRecords.includes(id);
              }
              this.selectedRecords = selectedRecords;
          });

      this._dataService.onGroupDataChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe( _record => {
              this.record = _record;
          });

      this._dataService.onFilterChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
              this._dataService.deselectRecords();
          });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }


    editRecord(record): void
    {
        this.dialogRef = this._matDialog.open(GroupsGroupFormDialogComponent, {
            panelClass: 'group-form-dialog',
            data      : {
                record: record,
                system: this._dataService.systemFilterBy,
                group: this._dataService.filterBy,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._dataService.updateRecord('edit', formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteRecord(record);

                        break;
                }
            });
    }

    deleteRecord(record): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = '¿Está seguro que desea eliminar este grupo?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._dataService.deleteRecord(record);
            }
            this.confirmDialogRef = null;
        });
    }

    enableDisable(enabled: boolean, record): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        let message = '¿Está seguro que desea deshabilitar este grupo?';
        if (enabled) {
            message = '¿Está seguro que desea HABILITAR este grupo?';
        }

        this.confirmDialogRef.componentInstance.confirmMessage = message;

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._dataService.enableDisable(enabled, record);
            }
            this.confirmDialogRef = null;
        });

    }

    actionGroup(member, record, event) {
        const data = {
            user: member.id,
            group: record.id,
            checked: event.checked
        };

        this._dataService.actionGroup(data).then ((resp: any)=> {
            if (resp.ok) {
                if(resp.data.response.users) {
                    record.users = resp.data.response.users;
                }
            }
        });

    }

    checkRecordMember(_record, member): boolean {
        const __record = this._dataService.records.find( record => record.id === _record.id);
        if ( typeof(__record.users) === 'string') {
            return __record.users.includes(member.id) || false;
        } else {
            return false;
        }
    }

    getAvatarMember(group, q: number = 0): any {
        const __group = this._dataService.records.find( _group => _group.id === group.id);
        let avatars = [];
        let count = 1;
        if ( typeof(__group.users) === 'string') {
            for (const user of __group.users.split(',')) {
                if (count > q && q !== 0) {
                    break;
                }
                count++;
                if (user) {
                    avatars.push({id: user,
                        avatar: this.recordMembersForAvatars
                        .filter( (_user: any) => {
                              return _user.id === user && _user.avatar;
                        })[0]
                       });
                }
            }
            return avatars;
            // return __group.users.includes(__group.id) || false;
        } else {
            return [];
        }
    }

    onSelectedChange(recordId): void
    {
        this._dataService.toggleSelectedRecord(recordId);
    }
   
}

export class FilesDataSource extends DataSource<any>
{

    constructor(
        private _dataService: GroupsService
    )
    {
        super();
    }

    connect(): Observable<any[]>
    {
        return this._dataService.onGroupsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
