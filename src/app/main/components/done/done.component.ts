import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.scss']
})
export class DoneComponent implements OnInit {

  @Input() message = '';
  constructor() { }

  ngOnInit() {
  }

}
