import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-close-session',
  templateUrl: './close-session.component.html',
  styleUrls: ['./close-session.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CloseSessionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onNoClick(): void {
    
  }
}
