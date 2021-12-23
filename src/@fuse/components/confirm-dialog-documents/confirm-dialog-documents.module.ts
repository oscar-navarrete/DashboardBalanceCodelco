import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule,MatIconModule,MatInputModule } from '@angular/material';
//import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {ConfirmDialogDocumentsComponent} from './confirm-dialog-documents.component'

@NgModule({
    declarations: [
        ConfirmDialogDocumentsComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule
    ],
    entryComponents: [
        ConfirmDialogDocumentsComponent
    ],
})
export class ConfirmDialogDocumentsModule
{
    
}
