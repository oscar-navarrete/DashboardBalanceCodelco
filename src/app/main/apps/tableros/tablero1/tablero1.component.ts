import { Component, OnInit } from '@angular/core';
import { CommonDashboardsService } from 'app/main/services/common-dashboards.service';


@Component({
  selector: 'app-tablero1',
  templateUrl: './tablero1.component.html',
  styleUrls: ['./tablero1.component.scss']
})


export class Tablero1Component implements OnInit {

  fecha: any;
  constructor(public common: CommonDashboardsService) {
    // this.common.datePickerCtrl.valueChanges.subscribe(x => {
    //   this.fecha = x._d;
    //   this.common.fecha = x._d;
    //   console.log(this.fecha);
    //   });    
  }

  ngOnInit() {
  }

}
