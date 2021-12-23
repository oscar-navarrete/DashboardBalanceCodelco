import { Component,Inject,ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { isThisSecond } from 'date-fns';

@Component({
    selector   : 'dialog-file',
    templateUrl: './dialog-viewer-file.component.html',
    styleUrls  : ['./dialog-viewer-file.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogFileComponent
{
    
    html;

    url;

    dialogTitle = "Archivo";

    full = false;
    
    constructor(public dialogRef: MatDialogRef<DialogFileComponent>,@Inject(MAT_DIALOG_DATA) private data: any,private sanitizer: DomSanitizer){
        //console.log(this.url);
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
        //console.log("url",data.url);
        //this.html = data.response;
        this.dialogTitle = data.title;
    }

    maximize(){
        this.full = !this.full;

        if(this.full==true){
            //this.dialogRef.updateSize('100vw','100vh')
            this.dialogRef.removePanelClass("dialog-file");
            this.dialogRef.addPanelClass("dialog-file-full-screen");
        }
        if(this.full==false){
            //this.dialogRef.updateSize('60%','85vh')
            this.dialogRef.removePanelClass("dialog-file-full-screen");
            this.dialogRef.addPanelClass("dialog-file");
        }
    }
}
