import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
import { CommonDashboardsService } from 'app/main/services/common-dashboards.service';
import { DashboardDataService } from 'app/main/services/dashboard-data.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ObjectsService } from 'app/main/services/objects.service';
import { DmhoxidosService } from '../../dashbalance/dmhoxidos.service';
import { GridOptions } from 'ag-grid-community';
import { Console, log } from 'console';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-monitoreo-vw2',
  templateUrl: './monitoreo-vw2.component.html',
  styleUrls: ['./monitoreo-vw2.component.scss']
})
export class MonitoreoVW2Component implements OnInit {

  fecha: any;
  config: any = {};
  updateFlag = false;
  valores: any[] = [];
  estadofechaejecucion: any[] = [];
  valor: any = {};
  DCH: any;
  DRT: any;
  DMH: any;
  DGM: any;
  DSA: any;
  DVE: any;
  DAN: any;
  DTE: any;
  FDCH: any;
  FDRT: any;
  FDMH: any;
  FDGM: any;
  FDSA: any;
  FDVE: any;
  FDAN: any;
  FDTE: any;
  mes: string;
  calibraciones: any[] = [];
  vmodelo: any[] = [];
  highcharts = Highcharts;
  Highcharts: typeof Highcharts = Highcharts;

  constructor(public common: CommonDashboardsService,
    private breakpointObserver: BreakpointObserver,
    public _service: DmhoxidosService,
    private ds: DashboardDataService,
    private objects: ObjectsService,
    private _fuseSidebarService: FuseSidebarService) {
    this.common.datePickerCtrl.valueChanges.subscribe(x => {
      this.fecha = x._d;
      this.common.fecha = x._d;
      //this.refreshData(x._d);
    });
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe(result => {
      if (result.matches) {
        this.config = this._service.observeBreakPoint(result);
      }
    });
  }

  ngOnInit() {
    //this.mes = moment().locale('es').format('MMMM YYYY');
    this.getFechaPortal();
    this.getMonitoreo();
    this.getCalibraciones();
    this.getDatosModelo();
    //this._service.getMesBalance();
    this._fuseSidebarService.getSidebar('navbar').fold();
  }

  async getFechaPortal() {
    const fportal: any = this._service.getBody('fechaportal', 'ds-001');
    await this.ds.getDataFromAPI(fportal).then((data: any) => {
      this.mes = data.fechaportal.Content.Value;
      //this.fechakpi = moment().locale('es').format('MMMM YYYY');
    });
  }

  async getMonitoreo() {
    const body: any = this.getBody('dash05', 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      const myData: any = data;

      const elementosMonitoreo: any = myData['ElementosMonitoreo'].Content.Items;
      const AtributosMonitoreo: any = myData['AttributosMonitoreo'].Content.Items;
      const ValoresMonitoreo: any = myData['ValoresMonitoreo'].Content.Items;

      const items: any[] = [];
      let indexBegin: number = 0;
      let indexEnd: number = 0;

      for (const index in elementosMonitoreo) {

        indexEnd = indexBegin + AtributosMonitoreo[index].Content.Items.length - 1;

        items.push({
          element: elementosMonitoreo[index].Name,
          attributes: AtributosMonitoreo[index].Content.Items.map((v: any) => v.Name),
          values: ValoresMonitoreo.filter((element: any, i: number) => {
            return (i >= indexBegin && i <= indexEnd)
          }).map((v: any) => v.Content.Value)
        });

        indexBegin = indexEnd + 1;

      }

      //console.log(items);

      const t: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === 'Fecha_RevisaResultado') {
            this.valores.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      const y: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === 'Estado_Fecha_Ejecucion_Limite') {
            this.estadofechaejecucion.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      //console.log(this.estadofechaejecucion);
      this.FDAN = this.valores[0].value
      this.FDAN != '-' ? this.FDAN = moment(this.FDAN, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FDAN = '-';

      this.FDCH = this.valores[1].value
      this.FDCH != '-' ? this.FDCH = moment(this.FDCH, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FDCH = '-';

      this.FDGM = this.valores[2].value
      this.FDGM != '-' ? this.FDGM = moment(this.FDGM, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FDGM = '-';

      this.FDMH = this.valores[3].value
      this.FDMH != '-' ? this.FDMH = moment(this.FDMH, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FDMH = '-';

      this.FDRT = this.valores[4].value
      this.FDRT != '-' ? this.FDRT = moment(this.FDRT, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FDRT = '-';

      this.FDSA = this.valores[5].value
      this.FDSA != '-' ? this.FDSA = moment(this.FDSA, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FDSA = '-';

      this.FDVE = this.valores[6].value
      this.FDVE != '-' ? this.FDVE = moment(this.FDVE, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FDVE = '-';

    });
  }

  async getCalibraciones() {
    const body: any = this.getBody('dash06', 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      const myData: any = data;

      const elementosCalibraciones: any = myData['ElementosCalibraciones'].Content.Items;
      const AtributosCalibraciones: any = myData['AttributosCalibraciones'].Content.Items;
      const ValoresCalibraciones: any = myData['ValoresCalibraciones'].Content.Items;

      const items: any[] = [];
      let indexBegin: number = 0;
      let indexEnd: number = 0;

      for (const index in elementosCalibraciones) {

        indexEnd = indexBegin + AtributosCalibraciones[index].Content.Items.length - 1;

        items.push({
          element: elementosCalibraciones[index].Name,
          attributes: AtributosCalibraciones[index].Content.Items.map((v: any) => v.Name),
          values: ValoresCalibraciones.filter((element: any, i: number) => {
            return (i >= indexBegin && i <= indexEnd)
          }).map((v: any) => v.Content.Value)
        });

        indexBegin = indexEnd + 1;

      }

      const y: any = items.map((v: any) => {
        return {
          element: v.element,
          values: v.attributes.map((x: any, index: number) => {
            return { name: x, value: v.values[index] }
          })
        }
      });

      //console.log(y);

      for (const item of y) {
        for (const column of item.values) {
          this.valor[column.name] = column.value;
        }
        this.calibraciones.push(this.valor);
        this.valor = {};
      }
      //console.log(this.calibraciones);

    });
  }

  async getDatosModelo() {
    const body: any = this.getBody('dash07', 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      const myData: any = data;

      const elementosModelo: any = myData['ElementosModelo'].Content.Items;
      const AtributosModelo: any = myData['AttributosModelo'].Content.Items;
      const ValoresModelo: any = myData['ValoresModelo'].Content.Items;

      const items: any[] = [];
      let indexBegin: number = 0;
      let indexEnd: number = 0;

      for (const index in elementosModelo) {

        indexEnd = indexBegin + AtributosModelo[index].Content.Items.length - 1;

        items.push({
          element: elementosModelo[index].Name,
          attributes: AtributosModelo[index].Content.Items.map((v: any) => v.Name),
          values: ValoresModelo.filter((element: any, i: number) => {
            return (i >= indexBegin && i <= indexEnd)
          }).map((v: any) => v.Content.Value)
        });

        indexBegin = indexEnd + 1;

      }

      //console.log(items);
      const t: any = items.map((v: any) => {
        return {
          element: v.element,
          values: v.attributes.map((x: any, index: number) => {
            return { name: x, value: v.values[index] }
          })
        }
      });

      //console.log(t);

      for (const item of t) {
        for (const column of item.values) {
          this.valor[column.name] = column.value;
        }
        this.vmodelo.push(this.valor);
        this.valor = {};
      }

      this.graficoDch(this.vmodelo[2]);
      this.graficoDrt(this.vmodelo[5]);
      this.graficoDmh(this.vmodelo[4]);
      this.graficoDgm(this.vmodelo[3]);
      this.graficoDsa(this.vmodelo[6]);
      this.graficoDve('-');
      // this.graficoDve(this.vmodelo[8]);
      this.graficoDan(this.vmodelo[1]);
      this.graficoDte('-');
      //this.graficoDte(this.vmodelo[7]);
      //console.log(this.vmodelo);

    });
  }

  public getBody(queryCode: string, dsCode: string) {
    const f = new Date(moment(this.fecha).format('YYYY-MM-DD') + ' 00:00:00');
    const hoy = moment(f);

    const body = {
      initDateTime: moment(f).locale('es').add(28800, 'seconds').format('DD-MM-YYYY HH:mm:ss'),
      endDateTime: moment(f).locale('es').add(71999, 'seconds').format('DD-MM-YYYY HH:mm:ss'),
      // initWeek: moment(f).locale('es-CL').add(diaSemana*-1,'days').format('DD-MM-YYYY'),
      // endWeek: moment(f).locale('es-CL').add(diaSemana*-1,'days').add(6,'days').format('DD-MM-YYYY'),
      startTime: moment(f).locale('es').add(28800, 'seconds').format('DD-MM-YYYY HH:mm:ss'),
      end: moment(f).locale('es').add(46800, 'seconds').format('DD-MM-YYYY HH:mm:ss'),
      //startTime: moment(f).format('YYYY-MM-DD') + ' 08:00:00',
      //end: moment(f).format('YYYY-MM-DD') + ' 13:00:00',
      // initDateTime: moment(f).locale('es').add(initTimeWeek,'seconds').format('DD-MM-YYYY'),
      // endDateTime: moment(f).locale('es').add(endTimeWeek,'seconds').format('DD-MM-YYYY'),
      queryCode,
      dsCode,
      type: 'API-PIAF'
    };

    return body;
  }

  graficoDch(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 1, `DIVISION`, ' CHUQUICAMATA', '%');
    setTimeout(() => {
      this.DCH = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDrt(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 2, `DIVISION`, ' RADOMIRO TOMIC', '%');
    setTimeout(() => {
      this.DRT = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDmh(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 3, `DIVISION`, ' MINISTRO HALES', '%');
    setTimeout(() => {
      this.DMH = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDgm(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 4, `DIVISION`, ' GABRIELA MISTRAL', '%');
    setTimeout(() => {
      this.DGM = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDsa(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 5, `DIVISION`, ' EL SALVADOR', '%');
    setTimeout(() => {
      this.DSA = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDve(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 6, `DIVISION`, ' VENTANAS', '%');
    setTimeout(() => {
      this.DVE = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDan(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 7, `DIVISION`, ' ANDINA', '%');
    setTimeout(() => {
      this.DAN = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDte(data: any): void {
    const info: any = this.getGaugueVWConfig(data, 8, `DIVISION`, ' EL TENIENTE', '%');
    setTimeout(() => {
      this.DTE = this.objects.getGaugueVW(info);
      this.updateFlag = true;
    }, 2000);
  }

  getGaugueVWConfig(data: any, id: number, title: string = '', subtitle: string = '', um: string = ''): any {


    //console.log(data.Calidad_Dato_Mes_Actual);

    //plotbands
    //   [{
    //     from: 0,
    //     to: 120,
    //     color: '#55BF3B' // green
    // }, {
    //     from: 120,
    //     to: 160,
    //     color: '#DDDF0D' // yellow
    // }, {
    //     from: 160,
    //     to: 200,
    //     color: '#DF5353' // red
    // }]

    //   [{
    //     name: 'Speed',
    //     data: [0],
    //     tooltip: {
    //         valueSuffix: ' km/h'
    //     }
    // }]
    const plotbands: any = [{
      from: 95,
      to: 100,
      color: '#55BF3B', // green
      innerRadius: '85%',
      outerRadius: '105%'
    }, {
      from: 70,
      to: 95,
      color: '#DDDF0D', // yellow
      innerRadius: '85%',
      outerRadius: '105%'
    }, {
      from: 0,
      to: 70,
      color: '#DF5353', // red
      innerRadius: '85%',
      outerRadius: '105%'
    }];


    const series: any = [{
      yAxis: 1,
      name: 'Calidad Dato',
      data: [data.Calidad_Dato_Mes_Actual],
      tooltip: {
        valueSuffix: '%'
      }
    }];

    // series.push({
    //   //data: data.map((d: any) => round(d.value, 1))
    // })

    const returnData: any = {
      plotbands,
      series,
      title,
      subtitle
    };
    //console.log(returnData);
    return returnData;
  }

}
