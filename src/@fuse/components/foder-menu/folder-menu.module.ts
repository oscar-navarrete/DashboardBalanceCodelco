import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule,MatIconModule,MatInputModule } from '@angular/material';
import {FolderMenuComponent} from './folder-menu.component'
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule} from '@angular/material/menu';
import {MenuItemComponent} from './menu-item/menu-item.component'

@NgModule({
    declarations: [
        FolderMenuComponent,
        MenuItemComponent
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
        /*BrowserAnimationsModule,NoopAnimationsModule,*/
        MatMenuModule,
    ],
    entryComponents: [
        
    ],
    exports:[FolderMenuComponent]
})
export class FolderMenuModule
{
    
}
