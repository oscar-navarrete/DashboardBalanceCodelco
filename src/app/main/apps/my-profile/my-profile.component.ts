import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { User } from 'app/main/models/security.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'app/main/services/auth.service';
import { UsersService } from 'app/main/apps/contacts/users.service';
import { fuseAnimations } from '@fuse/animations';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { formatDate } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { NotificatorService } from 'app/main/services/notificator.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarViewerDialogComponent } from 'app/main/components/avatar-viewer/avatar-viewer.component';


export const PICK_FORMATS = {
    parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
    display: {
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'short'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'}
    }
  };
  
export class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MM-yyyy', this.locale);
        } else {
            return date.toDateString();
        }
    }
  }


@Component({
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
]
})
export class MyProfileFormDialogComponent implements OnInit {
 
  contact: User;
  contactForm: FormGroup;
  dialogTitle: string;
  disabled = false;
  group: string;
  fileToUpload: File = null;
  dialogAvatarViewer: any;

  constructor(public matDialogRef: MatDialogRef<MyProfileFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private _formBuilder: FormBuilder,
              public _auth: AuthService,
              private _user: UsersService,
              private _notificator: NotificatorService,
              private _matDialog: MatDialog)  {

                this.dialogTitle = 'Perfil del Usuario';
                this.contact = new User({});
                this.contactForm = this.createContactForm();
                this.disabled = true;
    }

            async ngOnInit() {
                await this._user.getUserByToken().then( (user: any) => {
                    this.contact = user;
                    this.contactForm = this.createContactForm();
                });
        }

        handleFileInput(files: FileList): void {
            this.fileToUpload = files.item(0);
            // Validaciones

            // Upload
            this._user.updateAvatar(this.fileToUpload).then( (resp: any) => {
                if (resp.ok) {
                    if (resp.data.response) {
                        if (environment.api_server.substr(environment.api_server.length - 1, 1).includes('/')) {
                            this._auth.userImageUrl = environment.api_server.substr(0, environment.api_server.length - 1 ) + resp.data.response.avatar;
                          } else {
                            this._auth.userImageUrl = environment.api_server + resp.data.response.avatar;
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
                    imageUrl: this._auth.userImageUrl,
                    name: this._auth.user.name + ' ' + this._auth.user.lastName,
                    jobTitle: this._auth.user.jobTitle,
                    notes: this._auth.user.notes 
                }
            });
        }
    

            createContactForm(): FormGroup
            {
                return this._formBuilder.group({
                    id      : [this.contact.id],
                    name    : [this.contact.name],
                    lastName: [this.contact.lastName],
                    avatar  : [this.contact.avatar],
                    nickname: [this.contact.nickname],
                    username : new FormControl({value: this.contact.username, disabled: true}),
                    jobTitle: [this.contact.jobTitle],
                    email   : new FormControl({value: this.contact.email, disabled: true}),
                    phone   : [this.contact.phone],
                    address : [this.contact.address],
                    birthday: [this.contact.birthday],
                    notes   : [this.contact.notes]
                });
            }
        }
        
