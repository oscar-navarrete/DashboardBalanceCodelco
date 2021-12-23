import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  title: string;
  message: string;
  options: any[];
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
  }

  onNok(): void {
    this.dialogRef.close('nok');
  }
  onOk(): void {
    this.dialogRef.close('ok');
  }
  terminate(value): void {
    this.dialogRef.close(value);
  }

}
