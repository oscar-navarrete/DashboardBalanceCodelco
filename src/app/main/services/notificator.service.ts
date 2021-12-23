import { Injectable } from '@angular/core';

import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarRef
} from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class NotificatorService {

  snackBarConfig: MatSnackBarConfig;
  snackBarRef: MatSnackBarRef<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  snackBarAutoHide = '5000';

  constructor(private snackBar: MatSnackBar) { }

  alert(message: string, action: string, duration: number): void {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = this.horizontalPosition;
    this.snackBarConfig.verticalPosition = this.verticalPosition;
    this.snackBarConfig.duration = duration || parseInt(this.snackBarAutoHide, 0);
    this.snackBarConfig.panelClass = 'glam-snackbar';
    this.snackBarRef = this.snackBar.open(message, action, this.snackBarConfig);
  }

}
