import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { GroupsService } from '../groups.service';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SelectedBarComponent implements OnInit, OnDestroy {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  hasSelectedContacts: boolean;
  isIndeterminate: boolean;
  selectedRecords: string[];

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
      public _dataService: GroupsService,
      public _matDialog: MatDialog
  )
  {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void
  {
      this._dataService.onSelectedGroupsChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(selectedRecords => {
              this.selectedRecords = selectedRecords;
              setTimeout(() => {
                  this.hasSelectedContacts = selectedRecords.length > 0;
                  this.isIndeterminate = (selectedRecords.length !== this._dataService.records.length && selectedRecords.length > 0);
              }, 0);
          });
  }


  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  selectAll(): void
  {
      this._dataService.selectRecords();
  }


  deselectAll(): void
  {
      this._dataService.deselectRecords();
  }

  deleteSelectedRecords(): void
  {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = '¿Está seguro que desea eliminar todos los grupos seleccionadas?';

      this.confirmDialogRef.afterClosed()
          .subscribe(result => {
              if ( result )
              {
                  this._dataService.deleteSelectedRecords();
              }
              this.confirmDialogRef = null;
          });
  }

  
}
