import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
import { CommonDashboardsService } from 'app/main/services/common-dashboards.service';
import { DashboardDataService } from 'app/main/services/dashboard-data.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ObjectsService } from 'app/main/services/objects.service';
import { datosTabla, DmhoxidosService } from '../dmhoxidos.service';
import { interval, Observable } from 'rxjs';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

//import { GridApi, GridOptions } from 'ag-grid-community';


@Component({
  selector: 'app-dmhoxidos',
  templateUrl: './dmhoxidos.component.html',
  styleUrls: ['./dmhoxidos.component.scss']
})
export class DmhoxidosComponent implements OnInit {


  // tbl01 = [];
  // tbldmh = [];
  // tbl01ColDef = [
  //   { headerName: 'Variable', field: 'variable', width: 250, resizable: true },
  //   { headerName: 'Tipo (IMD/Auto)', field: 'tipo', autoHeight: true, width: 150, cellStyle: { color: 'black' } },
  //   { headerName: 'Fecha Última Actualización', field: 'fecha', autoHeight: true },
  //   { headerName: 'Último Valor', field: 'ultimovalor', autoHeight: true, valueFormatter: params => params.data.ultimovalor.toFixed(0) },
  //   { headerName: 'Rango Variable', field: 'rango', autoHeight: true },
  //   { headerName: 'offset Actualización', field: 'offset', autoHeight: true },
  //   { headerName: 'Responsable (Válido IMD)', field: 'responsable', autoHeight: true },
  //   { headerName: 'Estado Actualización Dato', field: 'estadoupdate', autoHeight: true },
  //   { headerName: 'Estado Calidad Datos', field: 'estadocalidad', autoHeight: true },
  //   { headerName: 'Estado Fuera de Rango', field: 'estadooutrango', autoHeight: true },
  //   { headerName: 'Estado no Ingresado (IMD)', field: 'estadonoingresado', hide: false, autoHeight: true }
  // ];



  // datos: datosTabla[];
  // datos1: datosTabla[] = [];  //temporal
  // datosdmh: datosTabla[] = [];



  highcharts = Highcharts;
  Higcharts: typeof Highcharts = Highcharts;

  // datosLinea1: any;
  // actualizaLinea1: boolean = false;

  updateFlag = false;

  fecha: any;
  // tipoObjeto: any = ''; //Variable debe servir para filtrar por turno.
  // tendenciaNivelHT: any;
  // flujosTren: any;
  config: any = {};

  // elements: string[] = [];

  datosConcentradoraDmh: any[] = [];
  datosConcentradoraDan: any[] = [];
  datosTostacionDmh: any[] = [];
  datosOxidosDmh: any[] = [];
  valores: any[] = [];
  valor: any = {};



  constructor(public common: CommonDashboardsService,
    private breakpointObserver: BreakpointObserver,
    private _service: DmhoxidosService,
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
    this.generaTablas();
    const source = interval(1000 * 60 * 5);
    const subscription = source.subscribe(resp => this.generaTablas());
    this._fuseSidebarService.getSidebar('navbar').fold();
  }

  generaTablas() {
    this.getDataConcentradora('tabladmhconcentradora');
    this.getDataTostacion('tabladmhtostacion');
    this.getDataOxidos('tabladmhoxidos');
    this.getDataDanConcentradora('tabladanconcentradora');
  }

  async getDataDanConcentradora(queryCode: string) {
    const body: any = this.getBody(queryCode, 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      this.datosConcentradoraDan = this.creaTabla(data, 'ElementosTDANConcentradora', 'ValoresTDANConcentradora', 'AtributosTDANConcentradora');
    });
  }

  async getDataConcentradora(queryCode: string) {
    const body: any = this.getBody(queryCode, 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      this.datosConcentradoraDmh = this.creaTabla(data, 'ElementosTDMHConcentradora', 'ValoresTDMHConcentradora', 'AtributosTDMHConcentradora');
    });
  }

  async getDataTostacion(queryCode: string) {
    const body: any = this.getBody(queryCode, 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      this.datosTostacionDmh = this.creaTabla(data, 'ElementosTDMHTostacion', 'ValoresTDMHTostacion', 'AtributosTDMHTostacion');
    });
  }

  async getDataOxidos(queryCode: string) {
    const body: any = this.getBody(queryCode, 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      this.datosOxidosDmh = this.creaTabla(data, 'ElementosTDMHOxidos', 'ValoresTDMHOxidos', 'AtributosTDMHOxidos');
    });
  }

  // this.datosTostacionDmh = this.creaTabla(data, 'ElementosTDMHTostacion', 'ValoresTDMHTostacion', 'AtributosTDMHTostacion');

  creaTabla(data: any, elements: string, valores: string, atributos: string): any[] {

    this.valores = [];
    this.valor = {};

    const myData: any = data;

    const elementosTabla: any = myData[elements].Content.Items;
    const elementosValores: any = myData[valores].Content.Items;
    const elementosDMHAtributos: any = myData[atributos].Content.Items;

    const items: any[] = [];
    let indexBegin: number = 0;
    let indexEnd: number = 0;

    for (const index in elementosTabla) {

      indexEnd = indexBegin + elementosDMHAtributos[index].Content.Items.length - 1;

      items.push({
        element: elementosTabla[index].Name,
        attributes: elementosDMHAtributos[index].Content.Items.map((v: any) => v.Name),
        values: elementosValores.filter((element: any, i: number) => {
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


    for (const item of y) {
      for (const column of item.values) {
        this.valor[column.name] = column.value
      }
      this.valores.push(this.valor);
      this.valor = {};
    }

    return this.valores;
  }

  // crearTabla(queryCode: string, elements: string, valores: string, atributos: string): any[] {

  //   //datos = [];
  //   this.valores = [];
  //   this.valor = {};

  //   const body: any = this.getBody(queryCode, 'ds-001');
  //   this.ds.getDataFromAPI(body).then((data: any) => {

  //     const myData: any = data;

  //     const elementosTabla: any = myData[elements].Content.Items;
  //     const elementosValores: any = myData[valores].Content.Items;
  //     const elementosDMHAtributos: any = myData[atributos].Content.Items;

  //     const items: any[] = [];
  //     let indexBegin: number = 0;
  //     let indexEnd: number = 0;

  //     for (const index in elementosTabla) {

  //       indexEnd = indexBegin + elementosDMHAtributos[index].Content.Items.length - 1;

  //       items.push({
  //         element: elementosTabla[index].Name,
  //         attributes: elementosDMHAtributos[index].Content.Items.map((v: any) => v.Name),
  //         values: elementosValores.filter((element: any, i: number) => {
  //           return (i >= indexBegin && i <= indexEnd)
  //         }).map((v: any) => v.Content.Value)
  //       });

  //       indexBegin = indexEnd + 1;

  //     }

  //     const y: any = items.map((v: any) => {
  //       return {
  //         element: v.element,
  //         values: v.attributes.map((x: any, index: number) => {
  //           return { name: x, value: v.values[index] }
  //         })
  //       }
  //     });


  //     for (const item of y) {
  //       for (const column of item.values) {
  //         this.valor[column.name] = column.value
  //       }
  //       this.valores.push(this.valor);
  //       this.valor = {};
  //     }
  //     //console.log(this.datosConcentradoraDmh);
  //   });

  //   return this.valores;
  // }

  // async tabladmhconcentradora(){
  //   this.crearTabla()
  // }



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


}
