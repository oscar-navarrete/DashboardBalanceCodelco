import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-avatar-viewer',
  templateUrl: './avatar-viewer.component.html',
  styleUrls: ['./avatar-viewer.component.scss']
})
export class AvatarViewerDialogComponent implements OnInit {

  imageUrl = '';
  name = '';
  jobTitle = '';
  notes = '';
  constructor(public matDialogRef: MatDialogRef<AvatarViewerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any) { 
                this.imageUrl = _data.imageUrl;
                this.name = _data.name;
                this.jobTitle = _data.jobTitle;
                this.notes = _data.notes;
              }

  ngOnInit() {
  }

}
