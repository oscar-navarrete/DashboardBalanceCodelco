import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material';
import { CommonDashboardsService } from 'app/main/services/common-dashboards.service';
import { DashboardDataService } from 'app/main/services/dashboard-data.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ObjectsService } from 'app/main/services/objects.service';
import { DmhoxidosService } from '../dmhoxidos.service';
import { GridOptions } from 'ag-grid-community';
import { Console, log } from 'console';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-monitoreobalancert',
  templateUrl: './monitoreobalancert.component.html',
  styleUrls: ['./monitoreobalancert.component.scss']
})
export class MonitoreobalancertComponent implements OnInit {
  config: any = {};
  updateFlag = false;
  valores: any[] = [];
  valor: any = {};
  data_modelo: any[] = [];
  grafmesanterior: any;
  grafmesactual: any;
  calibraciones: any[] = [];
  areasrt: any[] = [];
  mes: string;
  grafcalibraciondmh: any;
  highcharts = Highcharts;
  Highcharts: typeof Highcharts = Highcharts;
  FRevisaArea: any;
  FRevisaDatos: any;
  FRecoleccionDatos: any;
  FEjecucion: any;
  FRevisaResultado: any;

  constructor(public common: CommonDashboardsService,
    private breakpointObserver: BreakpointObserver,
    private _service: DmhoxidosService,
    private ds: DashboardDataService,
    private objects: ObjectsService,
    private _fuseSidebarService: FuseSidebarService) { }

  ngOnInit() {
    //this.mes = moment().locale('es').format('MMMM YYYY');
    this.getFechaPortal();
    this.getDatosModelo();
    this.getCalibraciones();
    this.getMonitoreo();
    this.getDatosAreas();
    this._fuseSidebarService.getSidebar('navbar').fold();
  }

  async getFechaPortal() {
    const fportal: any = this._service.getBody('fechaportal', 'ds-001');
    await this.ds.getDataFromAPI(fportal).then((data: any) => {
      this.mes = data.fechaportal.Content.Value;
      //this.fechakpi = moment().locale('es').format('MMMM YYYY');
    });
  }

  MonitoreoDMH(data: any): void {
    const infoanterior: any = this.getGaugueConfig(data[5], data[5].Calidad_Dato_Mes_Anterior, 1, `MES`, ' ANTERIOR', '');
    const infoactual: any = this.getGaugueConfig(data[5], data[5].Calidad_Dato_Mes_Actual, 2, `ACUMULADO`, ' MES ACTUAL', '');
    setTimeout(() => {
      this.grafmesanterior = this.objects.getGaugue(infoanterior);
      this.grafmesactual = this.objects.getGaugue(infoactual);
      this.updateFlag = true;
    }, 2000);
  }

  async getDatosAreas() {
    const body: any = this._service.getBody('RT', 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      const myData: any = data;

      const elementosRT: any = myData['ElementosAreaRT'].Content.Items;
      const AtributosRT: any = myData['AttributosAreaRT'].Content.Items;
      const ValoresRT: any = myData['ValoresAreaRT'].Content.Items;

      const items: any[] = [];
      let indexBegin: number = 0;
      let indexEnd: number = 0;

      for (const index in elementosRT) {

        indexEnd = indexBegin + AtributosRT[index].Content.Items.length - 1;

        items.push({
          element: elementosRT[index].Name,
          attributes: AtributosRT[index].Content.Items.map((v: any) => v.Name),
          values: ValoresRT.filter((element: any, i: number) => {
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

      console.log(items);

      for (const item of y) {
        for (const column of item.values) {
          this.valor[column.name] = column.value;
        }
        this.areasrt.push(this.valor);
        this.valor = {};
      }
      //console.log(this.areasdmh);


    });

  }

  async getCalibraciones() {
    const body: any = this._service.getBody('dash06', 'ds-001');
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

      //console.log(items);

      for (const item of y) {
        for (const column of item.values) {
          this.valor[column.name] = column.value;
        }
        this.calibraciones.push(this.valor);
        this.valor = {};
      }
      //console.log(this.calibraciones);
      this.graficoCalibraciones(this.calibraciones);

    });
  }

  graficoCalibraciones(data: any): void {
    const info: any = this._service.getGraficoDivision(data[4], 1, `REGISTRO CALIBRACIONES`, ' ÚLTIMOS 3 MESES', 'N° Calibraciones', null, true);
    setTimeout(() => {
      this.grafcalibraciondmh = this.objects.getSimpleColumnChart(info);
      this.updateFlag = true;
    }, 2000);
  }

  async getDatosModelo() {
    const body: any = this._service.getBody('dash07', 'ds-001');
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

      for (const item of t) {
        for (const column of item.values) {
          this.valor[column.name] = column.value;
        }
        this.data_modelo.push(this.valor);
        this.valor = {};
      }

      //console.log(this.data_modelo);
      this.MonitoreoDMH(this.data_modelo);

    });

  }

  //OBTIENE DATOS DE ELEMENTO MONITOREO
  async getMonitoreo() {
    const body: any = this._service.getBody('dash05', 'ds-001');
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

      //console.log(this.valores);
      this.FRevisaArea = this.valores[4].Fecha_RevisaArea;
      this.FRevisaArea != '-' ? this.FRevisaArea = moment(this.FRevisaArea, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FRevisaArea = '-';
      this.FRevisaDatos = this.valores[4].Fecha_RevisaDatos;
      this.FRevisaDatos != '-' ? this.FRevisaDatos = moment(this.FRevisaDatos, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FRevisaDatos = '-';
      this.FRecoleccionDatos = this.valores[4].FRecoleccionDatos;
      this.FRecoleccionDatos != '-' ? this.FRecoleccionDatos = moment(this.FRecoleccionDatos, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FRecoleccionDatos = '-';
      this.FEjecucion = this.valores[4].FEjecucion;
      this.FEjecucion != '-' ? this.FEjecucion = moment(this.FEjecucion, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FEjecucion = '-';
      this.FRevisaResultado = this.valores[4].FRevisaResultado;
      this.FRevisaResultado != '-' ? this.FRevisaResultado = moment(this.FRevisaResultado, "D-MM-YYYY HH:mm").format('D-MM-YYYY HH:mm') : this.FRevisaResultado = '-';

    });
  }


  getGaugueConfig(datalimites: any, value: number, id: number, title: string = '', subtitle: string = '', um: string = ''): any {


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
      color: '#55BF3B', //green
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
      color: '#DF5353', //red
      innerRadius: '85%',
      outerRadius: '105%'
    }];


    const series: any = [{
      yAxis: 1,
      name: 'Calidad Dato',
      data: [value],
      tooltip: {
        valueSuffix: ''
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
