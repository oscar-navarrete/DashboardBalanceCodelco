import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FeaturesService } from './features.service';
import { FeaturesFeatureFormDialogComponent } from './feature-form/feature-form.component';

@Component({
  selector: 'features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class FeaturesComponent implements OnInit, OnDestroy {

  dialogRef: any;
  hasSelectedRecords: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;


    constructor(
        private _dataService: FeaturesService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._dataService.onSelectedFeaturesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedItems => {
                this.hasSelectedRecords = selectedItems.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._dataService.search(searchText);
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

    newFeature(): void
    {
        this.dialogRef = this._matDialog.open(FeaturesFeatureFormDialogComponent, {
            panelClass: 'feature-form-dialog',
            data      : {
                action: 'new',
                system: this._dataService.systemFilterBy,
                group: this._dataService.filterBy,
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }
                this._dataService.updateRecord('new', response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }


}
