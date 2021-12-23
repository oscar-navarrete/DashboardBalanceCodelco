import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { FeaturesService } from '../features.service';
import { FeaturesFeatureFormDialogComponent } from '../feature-form/feature-form.component';


@Component({
  selector: 'features-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class FeatureListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent', {static: false})
    dialogContent: TemplateRef<any>;

    records: any;
    record: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'icon', 'name', 'title', 'route', 'description', 'buttons'];
    selectedRecords: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    searchInput: FormControl;

    recordGroups: any[] = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ContactsService} _contactsService
   * @param {MatDialog} _matDialog
   */
  constructor(
      public _dataService: FeaturesService,
      public _matDialog: MatDialog
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
      this.dataSource = new FilesDataSource(this._dataService);

      this.recordGroups = this._dataService.recordGroups;

      this.searchInput.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              distinctUntilChanged()
          )
          .subscribe((searchText: string) => {
              this.recordGroups = this._dataService.recordGroups.filter( _group => {
                  return _group.name.toLowerCase().includes(searchText.toLowerCase());
              });
          });

      this._dataService.onFeaturesChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe( _records => {
              this.records = _records;

              this.checkboxes = {};
              _records.map( _record => {
                  this.checkboxes[_record.id] = false;
              });
          });

      this._dataService.onSelectedFeaturesChanged
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

      this._dataService.onFeatureDataChanged
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

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }


    editRecord(record): void
    {
        this.dialogRef = this._matDialog.open(FeaturesFeatureFormDialogComponent, {
            panelClass: 'feature-form-dialog',
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

        this.confirmDialogRef.componentInstance.confirmMessage = '¿Está seguro que desea eliminar esta característica?';

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

        let message = '¿Está seguro que desea deshabilitar esta característica?';
        if (enabled) {
            message = '¿Está seguro que desea HABILITAR esta característica?';
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

    actionGroup(group, record, event) {
        const data = {
            group: group.id,
            feature: record.id,
            checked: event.checked
        };

        this._dataService.actionGroup(data);

    }

    checkRecordGroup(_record, member): boolean {
        const __record = this._dataService.records.find( record => record.id === _record.id);
        if ( typeof(__record.groups) === 'string') {
            return __record.groups.includes(member.id) || false;
        } else {
            return false;
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
        private _dataService: FeaturesService
    )
    {
        super();
    }

    connect(): Observable<any[]>
    {
        return this._dataService.onFeaturesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
