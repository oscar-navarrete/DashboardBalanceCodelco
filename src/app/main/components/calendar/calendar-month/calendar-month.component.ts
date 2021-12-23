import { Component, OnInit, Output, EventEmitter,Input,ViewChild, Provider } from '@angular/core';
import {MatDatepicker} from '@angular/material';
import * as moment from 'moment';

//LO SIGUIENTE SOLO PARA EL IDIOMA ESPAÑOL DEL CALENDARIO
import {MatDatepickerInputEvent, MatDatepickerInput} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


import {FormControl} from '@angular/forms';
import {Moment} from 'moment';

export const MY_FORMATS = {
  parse: {dateInput: 'MM/YYYY',},
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.css'],
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
export class CalendarMonthComponent implements OnInit {

  date = new FormControl(moment());

  @Output() calendarChanged = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    //console.log(this.date.value.format('MM-YYYY'));
    this.calendarChanged.emit("01-" + this.date.value.format('MM-YYYY'));
  }

}