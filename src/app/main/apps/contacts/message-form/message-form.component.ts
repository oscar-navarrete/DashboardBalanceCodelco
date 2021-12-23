import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { fuseAnimations } from '../../../../../@fuse/animations/index';
import { Notification, User } from '../../../models/security.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'app/main/apps/contacts/users.service';
import { NotificatorService } from 'app/main/services/notificator.service';
import { AvatarViewerDialogComponent } from 'app/main/components/avatar-viewer/avatar-viewer.component';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'message-form-dialog',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
})
export class MessageFormDialogComponent {


    action: string;
    notification: Notification;
    user: User;
    notificationForm: FormGroup;
    dialogTitle: string;
    disabled = false;
    dialogAvatarViewer: any;
    fileToUpload: File = null;

    constructor(public matDialogRef: MatDialogRef<MessageFormDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private _data: any,
                private _formBuilder: FormBuilder,
                private _matDialog: MatDialog,
                private _user: UsersService,
                private _notificator: NotificatorService) {
        // Set the defaults
        this.dialogTitle = _data.title || 'Envío de Notificación';
        this.user = _data.user;
        if (this.user !== undefined) {
          this.notification = new Notification({
            recipient: this.user.id || '',
            subject: '',
            message: ''
          });
        } else {
          this.notification = new Notification({
            recipient: '',
            subject: '',
            message: ''
          });
        }
        this.notificationForm = this.createContactForm();
    }

  ngOnInit() {
  }


  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
    // Validaciones

    // Upload
    this._user.updateUserAvatar(this.fileToUpload, this.user).then( (resp: any) => {
        if (resp.ok) {
            if (resp.data.response) {
                if (environment.api_server.substr(environment.api_server.length - 1, 1).includes('/')) {
                    this.user.avatar = environment.api_server.substr(0, environment.api_server.length - 1 ) + resp.data.response.avatar;
                  } else {
                    this.user.avatar = environment.api_server + resp.data.response.avatar;
                  }
            }
        } else {
            this._notificator.alert(resp.fileError.message, 'Cerrar', 5000);
        }
    });

}

  callAvatarViewer(): void {
        this.dialogAvatarViewer = this._matDialog.open(AvatarViewerDialogComponent, {
            panelClass: 'avatar-viewer-dialog',
            data      : {
                imageUrl: this.user.avatar,
                name: this.user.name + ' ' + this.user.lastName,
                jobTitle: this.user.jobTitle,
                notes: this.user.notes
            }
        });
}

createContactForm(): FormGroup
{
    return this._formBuilder.group({
        recipient: [this.notification.recipient],
        subject  : [this.notification.subject, Validators.required],
        message  : [this.notification.message, Validators.required]
    });
}

}
