import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { User } from 'app/main/models/security.model';
import { AvatarViewerDialogComponent } from 'app/main/components/avatar-viewer/avatar-viewer.component';
import { environment } from '../../../../../environments/environment';
import { UsersService } from 'app/main/apps/contacts/users.service';
import { NotificatorService } from 'app/main/services/notificator.service';
import { fuseAnimations } from '../../../../../@fuse/animations/index';

@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
})

export class ContactsContactFormDialogComponent
{
    action: string;
    contact: User;
    contactForm: FormGroup;
    dialogTitle: string;
    disabled = false;
    group: string;
    dialogAvatarViewer: any;
    fileToUpload: File = null;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _user: UsersService,
        private _notificator: NotificatorService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Editar Usuario';
            this.contact = _data.contact;
            this.disabled = true;
            this.contact.group = _data.group;
        }
        else
        {
            this.dialogTitle = 'Nuevo Usuario';
            this.contact = new User({});
            this.contact.group = _data.group;
        }


        this.contactForm = this.createContactForm();

        if ( this.action === 'edit' )
        {
            this.contactForm.get('email').disable();
            this.contactForm.get('username').disable();

            this.checkNeverExpire(_data.contact.neverExpire);
            this.checkChangeNext(_data.contact.changeNext);
        }

    }

    handleFileInput(files: FileList): void {
        this.fileToUpload = files.item(0);
        // Validaciones

        // Upload
        this._user.updateUserAvatar(this.fileToUpload, this.contact).then( (resp: any) => {
            if (resp.ok) {
                if (resp.data.response) {
                    if (environment.api_server.substr(environment.api_server.length - 1, 1).includes('/')) {
                        this.contact.avatar = environment.api_server.substr(0, environment.api_server.length - 1 ) + resp.data.response.avatar;
                      } else {
                        this.contact.avatar = environment.api_server + resp.data.response.avatar;
                      }
                }
            } else {
                this._notificator.alert(resp.fileError.message, 'Cerrar', 5000);
            }
        });

    }

    callAvatarViewer(): void {
        if (this.action === 'edit') {
            this.dialogAvatarViewer = this._matDialog.open(AvatarViewerDialogComponent, {
                panelClass: 'avatar-viewer-dialog',
                data      : {
                    imageUrl: this.contact.avatar,
                    name: this.contact.name + ' ' + this.contact.lastName,
                    jobTitle: this.contact.jobTitle,
                    notes: this.contact.notes
                }
            });
            }
    }

    checkNeverExpire(isChecked) {
        if (isChecked) {
            this.contactForm.get('changeNext').disable();
        } else {
            this.contactForm.get('changeNext').enable();
        }
    }

    checkChangeNext(isChecked) {
        if (isChecked) {
            this.contactForm.get('neverExpire').disable();
        } else {
            this.contactForm.get('neverExpire').enable();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.contact.id],
            password: [],
            name    : [this.contact.name, Validators.required],
            lastName: [this.contact.lastName],
            avatar  : [this.contact.avatar],
            nickname: [this.contact.nickname],
            username : [this.contact.username],
            jobTitle: [this.contact.jobTitle],
            email   : [this.contact.email, [Validators.required, Validators.email]],
            phone   : [this.contact.phone],
            address : [this.contact.address],
            birthday: [this.contact.birthday],
            notes   : [this.contact.notes],
            group   : [this.contact.group],
            neverExpire: [this.contact.neverExpire],
            changeNext: [this.contact.changeNext],
            domainUser: [this.contact.domainUser],
        });
    }
}
