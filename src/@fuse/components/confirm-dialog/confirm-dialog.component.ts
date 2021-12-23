import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent
{
    public confirmMessage: string;
    constructor(public dialogRef: MatDialogRef<FuseConfirmDialogComponent>,private _formBuilder: FormBuilder){
    }
}
