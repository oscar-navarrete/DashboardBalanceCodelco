import { Component, OnInit, Output, EventEmitter,Input,ViewChild, Provider } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {

  @Output() onChangeCalendar = new EventEmitter();

  @Input() type: string;

  constructor() { }

  ngOnInit() {

  }
  onChangeDate(date){
    this.onChangeCalendar.emit(date);
  }
}