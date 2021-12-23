import { Component, OnInit, Output, EventEmitter,Input,ViewChild, Provider } from '@angular/core';
import {MatDatepicker} from '@angular/material';
import * as moment from 'moment';

//LO SIGUIENTE SOLO PARA EL IDIOMA ESPAÑOL DEL CALENDARIO
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


import {FormControl} from '@angular/forms';
import {Moment} from 'moment';

export const MY_FORMATS = {
  parse: {dateInput: 'DD/MM/YYYY',},
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, 
      useValue: MY_FORMATS
    },
  ],
})
export class CalendarDayComponent implements OnInit {

  date = new FormControl(moment());

  @Output() calendarChanged = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChangeDay(event) {
    //console.log("AQUII",event.value.format('DD-MM-YYYY'));
    this.calendarChanged.emit(event.value.format('DD-MM-YYYY'));
  }
}