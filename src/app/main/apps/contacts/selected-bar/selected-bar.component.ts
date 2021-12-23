import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { UsersService } from 'app/main/apps/contacts/users.service';
import { MessageFormDialogComponent } from '../message-form/message-form.component';
import { FormGroup } from '@angular/forms';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class ContactsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedContacts: boolean;
    isIndeterminate: boolean;
    selectedContacts: string[];
    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _contactsService: UsersService,
        public _matDialog: MatDialog
    )
    {
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
        this._contactsService.onSelectedUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                this.selectedContacts = selectedContacts;
                setTimeout(() => {
                    this.hasSelectedContacts = selectedContacts.length > 0;
                    this.isIndeterminate = (selectedContacts.length !== this._contactsService.users.length && selectedContacts.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void
    {
        this._contactsService.selectContacts();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._contactsService.deselectContacts();
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = '¿Está seguro que desea eliminar todos los usuarios seleccionados?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._contactsService.deleteSelectedUsers();
                }
                this.confirmDialogRef = null;
            });
    }

    sendNotificationContacts(): void
    {

        this.dialogRef = this._matDialog.open(MessageFormDialogComponent, {
            panelClass: 'message-form-dialog',
            data      : {
                user: undefined,
                title: 'Notificación Grupal'
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
                console.log(formData.getRawValue());
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'send':
                        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
                            disableClose: false
                        });
                
                        this.confirmDialogRef.componentInstance.confirmMessage = `Hola ${this._contactsService.userConnected.name}
                        ¿Confirma el envío del mensaje a los usuarios seleccionados?`;
                
                        this.confirmDialogRef.afterClosed()
                            .subscribe(result => {
                                if ( result )
                                {
                                    this._contactsService.sendNotificationUsersSelected(formData.getRawValue()).then( (response: any) => {
                                        console.log(response);
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        
                        break;
                }
            });


        
    }
}
