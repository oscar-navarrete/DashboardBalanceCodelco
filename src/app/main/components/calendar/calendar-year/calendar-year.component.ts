import { Component, OnInit, Output, EventEmitter,Input,ViewChild, Provider } from '@angular/core';

@Component({
  selector: 'app-calendar-year',
  templateUrl: './calendar-year.component.html',
  styleUrls: ['./calendar-year.component.css'],
})
export class CalendarYearComponent implements OnInit {

  years: number[] = [2015,2016,2017,2018,2019,2020];

  @Output() calendarChanged = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  onChangeYear(event) {
    this.calendarChanged.emit("01-01-" + event.value);
  }

  getDefaultYear()
  {
    return (new Date()).getFullYear();
  }
}