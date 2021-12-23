import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Breakpoints } from '@angular/cdk/layout';
import { Series } from 'highcharts';
import { round } from 'lodash';
import { DashboardDataService } from 'app/main/services/dashboard-data.service';

export interface datosTabla {
  variable: string;
  tipo: number;
  periodo: number;
  fecha: string;
  ultimovalor: number;
  rango: number;
  offset: number;
  responsable: number;
  estadoupdate: any;
  estadocalidad: any;
  estadooutrango: any;
  estadonoingresado: any;
}

@Injectable({
  providedIn: 'root'
})
export class DmhoxidosService {

  fecha: any;
  cols: number = 4;
  configColumns: any = {};
  valor: any = {};
  mes_balance: any;
  fecha_portal: any;

  constructor(private ds: DashboardDataService) { }

  getConfig(): any {
    this.configColumns = {
      cols: 3,
      colspan: 2,
      breakPoint: { xl: 3, lg: 3, md: 2, sm: 1, xs: 1 },
      breakPointColspan: { xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }
    };
    return this.configColumns;
  }

  observeBreakPoint(result: any): any {
    if (result.breakpoints[Breakpoints.XSmall]) {
      this.configColumns.cols = this.configColumns.breakPoint.xs;
      this.configColumns.colspan = this.configColumns.breakPointColspan.xs;
    }
    if (result.breakpoints[Breakpoints.Small]) {
      this.configColumns.cols = this.configColumns.breakPoint.sm;
      this.configColumns.colspan = this.configColumns.breakPointColspan.sm;
    }
    if (result.breakpoints[Breakpoints.Medium]) {
      this.configColumns.cols = this.configColumns.breakPoint.md;
      this.configColumns.colspan = this.configColumns.breakPointColspan.md;
    }
    if (result.breakpoints[Breakpoints.Large]) {
      this.configColumns.cols = this.configColumns.breakPoint.lg;
      this.configColumns.colspan = this.configColumns.breakPointColspan.lg;
    }
    if (result.breakpoints[Breakpoints.XLarge]) {
      this.configColumns.cols = this.configColumns.breakPoint.xl;
      this.configColumns.colspan = this.configColumns.breakPointColspan.xl;
    }

    return this.configColumns;

  }

  public getMesBalance(): any {
    this.getMes();
  }

  public getFechaPortal(): string {
    const fportal: any = this.getBody('fechaportal', 'ds-001');
    this.ds.getDataFromAPI(fportal).then((data: any) => {
      this.fecha_portal = data.fechaportal.Content.Value;
      //console.log(this.fecha_portal);
    });
    return this.fecha_portal;
  }

  async getMes() {
    const body: any = this.getBody('kpiFecha', 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      this.mes_balance = data.fecha.Content.Value;
    });
    return this.mes_balance;
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

  getDataGraficoDesbalancePorNodo(data: any, id: number, title: string = '', subtitle: string = '', um: string = '', limite: number, legenda: boolean): any {

    const series: any = [];

    const categories: any = data.map((d: any) => {
      return { category: d.element }
    })

    series.push({
      name: 'DIVISIONES',
      data: data.map((d: any) => round(d.value, 1))
    })

    const returnData: any = {
      categories: data.map((d: any) => d.element),
      series,
      title,
      subtitle,
      limite,
      legenda,
      yAxis: um
    };
    //console.log(returnData);
    return returnData;
  }

  getGraficoDivision(data: any, id: number, title: string = '', subtitle: string = '', um: string = '', limite: number, legenda: boolean): any {
    //console.log(data);
    //   const series: any = [];
    moment.locale("es");

    const { ["Fecha_Mes-3"]: Fecha3, ["Fecha_Mes-2"]: Fecha2, ["Fecha_Mes-1"]: Fecha1 } = data;
    const { ["Cantidad_Mes-3_Realizada"]: R3, ["Cantidad_Mes-2_Realizada"]: R2, ["Cantidad_Mes-1_Realizada"]: R1 } = data;
    const { ["Cantidad_Mes-3_Programada"]: P3, ["Cantidad_Mes-2_Programada"]: P2, ["Cantidad_Mes-1_Programada"]: P1 } = data;

    const categories: any = [moment(Fecha3).format('MMMM-YYYY'), moment(Fecha2).format('MMMM-YYYY'), moment(Fecha1).format('MMMM-YYYY')];

    const series: any = [{
      name: 'Programado',
      data: [P3, P2, P1],
      color: '#E55302'
    }, {
      name: 'Real',
      data: [R3, R2, R1],
      color: '#C0B99D'
    }];

    const returnData: any = {
      categories,
      series,
      title,
      subtitle,
      limite,
      legenda,
      yAxis: um
    };
    //console.log(returnData);
    return returnData;
  }


}
