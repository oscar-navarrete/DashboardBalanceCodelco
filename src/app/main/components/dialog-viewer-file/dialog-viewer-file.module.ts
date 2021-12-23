import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule,MatIconModule,MatInputModule } from '@angular/material';
import { DialogFileComponent } from './dialog-viewer-file.component';
import {MatToolbarModule} from '@angular/material/toolbar'; 

@NgModule({
    declarations: [
        DialogFileComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        MatToolbarModule
    ],
    entryComponents: [
        DialogFileComponent
    ],
})
export class DialogFileModule{
    
}
