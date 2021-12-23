import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';

@Component({
    selector   : 'confirm-dialog-documents',
    templateUrl: './confirm-dialog-documents.component.html',
    styleUrls  : ['./confirm-dialog-documents.component.scss']
})
export class ConfirmDialogDocumentsComponent
{
    public confirmMessage: string;

    public includeComment:boolean = false;

    recordForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<ConfirmDialogDocumentsComponent>,private _formBuilder: FormBuilder){
        this.recordForm = this._formBuilder.group({
            comments : ["",[Validators.required]]
        })
    }

}
