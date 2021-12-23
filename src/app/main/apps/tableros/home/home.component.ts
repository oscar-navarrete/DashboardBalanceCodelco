import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
import { CommonDashboardsService } from 'app/main/services/common-dashboards.service';
import { DashboardDataService } from 'app/main/services/dashboard-data.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ObjectsService } from 'app/main/services/objects.service';
import { DatosPi, Pi } from './interfaces/datospi.interface';
import { ValoresPi, Item } from './interfaces/plotpi.interface';
import { HomeService } from './home.service';

// export interface PeriodicElement {
//   indicador: string;
//   ton: number;
//   potencia: number;
// }


// const ELEMENT_DATA: PeriodicElement[] = [
//   {indicador: 'A0', ton: 2.169, potencia: 16.741 },
//   {indicador: 'A1', ton: 1.017, potencia: 6.449 },
//   {indicador: 'A2', ton: 1.659, potencia: 7.533 },
// ];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  highcharts = Highcharts;
  Higcharts: typeof Highcharts = Highcharts;

  datosLinea1: any;
  actualizaLinea1: boolean = false;

  updateFlag = false;

  fecha: any;
  tipoObjeto: any = ''; //Variable debe servir para filtrar por turno.
  tendenciaNivelHT: any;
  flujosTren: any;
  config: any = {};

  ELEMENT_DATA: Pi[];
  datos: string;

  datapi: Pi[];
  items: ValoresPi;

  categorias: Item[] = [];
  ton: Item[] = [];

  displayedColumns: string[] = ['nombre', 'ton', 'potencia'];
  dataSource: MatTableDataSource<Pi>;

  opcionesFiltro: any = [
    { value: 'A', text: 'Turno A' },
    { value: 'B', text: 'Turno B' },
    { value: 'C', text: 'Turno C' }
  ];

  constructor(public common: CommonDashboardsService,
    private breakpointObserver: BreakpointObserver,
    private _service: HomeService,
    private ds: DashboardDataService,
    private objects: ObjectsService
  ) {
    this.common.datePickerCtrl.valueChanges.subscribe(x => {
      this.fecha = x._d;
      this.common.fecha = x._d;
      this.refreshData(x._d);
    });
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe(result => {
      if (result.matches) {
        this.config = this._service.observeBreakPoint(result);
      }
    });

  }

  ngOnInit() {
    this.refreshData(this.common.datePickerCtrl.value);
    setTimeout(async () => {
      this.updateFlag = true;
    }, 2000);

  }



  cambiarTipo() {
    this.refreshData(null);
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

  // public devuelveDatosLinea1(): any {
  //   return {
  //     title: 'Ton/Planta',
  //     subtitle: 'A-0',
  //     categories: this.items.Plota0.Content.Items.map(x => x.Timestamp),
  //     series: [
  //       { name: 'Ton', color: '#a94f34', data: this.items.Plota0.Content.Items.map(x => x.Value) },
  //     ]
  //   }
  // }

  // async crearLinea1() {
  //   this.actualizaLinea1 = await false;
  //   await setTimeout(async () => {
  //     this.datosLinea1 = this.objects.getSimpleLineChart(this.devuelveDatosLinea1());
  //     this.actualizaLinea1 = true;
  //   }, 2000)

  // }



  public getItem(body: any) {
    // const body = {
    //   dsCode: 'ds-001',
    //   queryCode: 'api02',
    //   type: 'API-PIAF'
    // };
    this.ds.getDataFromAPI(body).then((data: any) => {
      this.items = data;
      this.crearGraficoTendenciaNivelHT(data, 'Corriente-CtoE');
      this.crearGraficoFlujosTren(data, 'Flujos-Tren');

      //this.categorias = this.items.Plota0.Content.Items.map(x => x.Timestamp.toString());
      //console.log(this.categorias);
      //console.log(this.items.Plota0.Content.Items);
    })

    // this.crearLinea1();

  }

  refreshData(date: any): void {
    const body: any = this.getBody('dash01', 'ds-001');
    this.getItem(body);
  }



  async crearGraficoFlujosTren(data: any, id: any) {
    const d1 = this.common.buildData(data, [id, id + '-Valores']);
    const info: any = await d1[id].Content.Items
      .map((x: any) => {
        const i: any = x.Items.sort((a, b) => (a.Timestamp > b.Timestamp) ? 1 : -1)
        return { name: x.Name, items: i, um: x.UnitsAbbreviation }
      });

    console.log(info);

    const configChart: any = {
      title: `Flujo Tren m3/h (24h)`,
      subtitle: '',
      yAxis1Title: 'm3/h',
      yAxis2Title: '',
      xAxisTitle: 'Hora',
      series: await info.map((v: any) => {
        let name: string = v.name;
        name = name.split('. ')[name.split('. ').length - 1];
        return {
          name, yAxis: 0, data: v.items.map((v2: any) => {
            v2.Timestamp = v2.Timestamp.replace('', '');
            return [Date.UTC(new Date(v2.Timestamp).getFullYear(), new Date(v2.Timestamp).getMonth(), new Date(v2.Timestamp).getDate(), new Date(v2.Timestamp).getHours(), new Date(v2.Timestamp).getMinutes(), new Date(v2.Timestamp).getSeconds()), v2.Value]
          })
        }
      })
    }
    this.flujosTren = this.objects.graficoLineasIrregularesDobleEje(configChart);

  }

  async crearGraficoTendenciaNivelHT(data: any, id: any) {
    const d1 = this.common.buildData(data, [id, id + '-Valores']);
    const info: any = await d1[id].Content.Items
      .map((x: any) => {
        const i: any = x.Items.sort((a, b) => (a.Timestamp > b.Timestamp) ? 1 : -1)
        return { name: x.Name, items: i, um: x.UnitsAbbreviation }
      });

    console.log(info);

    const configChart: any = {
      title: `Corriente KAmp (24h)`,
      subtitle: '',
      yAxis1Title: 'KAmp',
      yAxis2Title: '',
      xAxisTitle: 'Hora',
      series: await info.map((v: any) => {
        let name: string = v.name;
        name = name.split('. ')[name.split('. ').length - 1];
        return {
          name, yAxis: 0, data: v.items.map((v2: any) => {
            v2.Timestamp = v2.Timestamp.replace('', '');
            return [Date.UTC(new Date(v2.Timestamp).getFullYear(), new Date(v2.Timestamp).getMonth(), new Date(v2.Timestamp).getDate(), new Date(v2.Timestamp).getHours(), new Date(v2.Timestamp).getMinutes(), new Date(v2.Timestamp).getSeconds()), v2.Value]
          })
        }
      })
    }
    this.tendenciaNivelHT = this.objects.graficoLineasIrregularesDobleEje(configChart);
    //graficoLineasIrregularesDobleEje(configChart);
  }

  // async refreshData() {
  //   const body = {
  //     dsCode: 'ds-001',
  //     queryCode: 'queryapi01',
  //     type: 'API-PIAF'
  //   };
  //   await setTimeout(async () => {
  //     this.ds.getDataFromAPI(body).then((data: any) => {
  //       this.crearTabla(data);
  //       console.log(data);
  //     })
  //   }, 3000)
  // }

  // crearTabla(data: any) {
  //   this.datapi = [
  //     {
  //       indicador: data.nombre.Content.Value[0],
  //       potencia: data.potencia.Content.Value[0],
  //       ton: data.ton.Content.Value[0],
  //       webid: data.webid.Content.Value[0]
  //     },
  //     {
  //       indicador: data.nombre.Content.Value[1],
  //       potencia: data.potencia.Content.Value[1],
  //       ton: data.ton.Content.Value[1],
  //       webid: data.webid.Content.Value[1]
  //     },
  //     {
  //       indicador: data.nombre.Content.Value[2],
  //       potencia: data.potencia.Content.Value[2],
  //       ton: data.ton.Content.Value[2],
  //       webid: data.webid.Content.Value[2]
  //     }
  //   ];

  //   this.datos = JSON.stringify(data.ton.Content.Value[0]);

  //   this.ELEMENT_DATA = this.datapi;
  //   this.dataSource = new MatTableDataSource<Pi>(this.ELEMENT_DATA);
  // }

}

