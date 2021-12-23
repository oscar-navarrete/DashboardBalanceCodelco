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
  selector: 'app-kpibalance',
  templateUrl: './kpibalance.component.html',
  styleUrls: ['./kpibalance.component.scss']
})
export class KpibalanceComponent implements OnInit {

  fecha: any;
  fechakpi: any;
  config: any = {};
  updateFlag = false;
  desbalance_cu: any;
  desbalancePorNodo: any;
  desbalanceglobal: any;
  incertidumbre: any;
  nroejecuciones: any;
  sobreajuste: any;
  ajusteinventario: any;
  mes: string;
  limites: any[] = [];
  highcharts = Highcharts;
  Highcharts: typeof Highcharts = Highcharts;

  //elementos: string[] = [];

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
    //this.mes = moment().locale('es').format('MMMM YYYY');
    this.getKpiBalance();
    this._fuseSidebarService.getSidebar('navbar').fold();
    // const dataModelo = this._service.getDatosModelo();
    // console.log(dataModelo);
    // setTimeout(async () => {
    //   this.updateFlag = true;
    // }, 2000);
  }

  async getKpiBalance() {

    const fkpi: any = this.getBody('kpiFecha', 'ds-001');
    await this.ds.getDataFromAPI(fkpi).then((data: any) => {
      this.fechakpi = data.fecha.Content.Value;
      //this.fechakpi = moment().locale('es').format('MMMM YYYY');
    });

    const body: any = this.getBody('dash04', 'ds-001');
    await this.ds.getDataFromAPI(body).then((data: any) => {
      const myData: any = data;

      console.log(myData);

      const elementosKpiBalance: any = myData['ElementosKpiBalance'].Content.Items;
      const elementosValores: any = myData['ValoresKpiBalance'].Content.Items;
      const elementosAtributos: any = myData['AttributosKpiBalance'].Content.Items;

      const items: any[] = [];

      const valores: any[] = [];
      const fdesbalanceglobal: any[] = [];
      const incertidumbre: any[] = [];
      const nejecuciones: any[] = [];
      const sobreajus: any[] = [];
      const ajuste: any[] = [];
      let indexBegin: number = 0;
      let indexEnd: number = 0;

      for (const index in elementosKpiBalance) {

        indexEnd = indexBegin + elementosAtributos[index].Content.Items.length - 1;

        items.push({
          element: elementosKpiBalance[index].Name,
          attributes: elementosAtributos[index].Content.Items.map((v: any) => v.Name),
          values: elementosValores.filter((element: any, i: number) => {
            return (i >= indexBegin && i <= indexEnd)
          }).map((v: any) => v.Content.Value)
        });

        indexBegin = indexEnd + 1;

      }

      //console.log(items);

      //Limites
      const lim: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === '%Ajuste_Inventarios_Cu_Limite' || v.attributes[ind] === '%Sobreajuste_Limite'
            || v.attributes[ind] === 'Desbalance_Por_Nodo_Cu_Limite' || v.attributes[ind] === 'Factor_Desbalance_Global_Cu_Limite'
            || v.attributes[ind] === 'Incertidumbre_Dato_Base_Cu_Limite' || v.attributes[ind] === 'Nro_Ejecuciones_Cu_Limite') {
            this.limites.push({
              attributes: v.attributes[ind],
              value: x
            })
          }
        })
      })

      //console.log(this.limites);

      const t: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === 'Desbalance_Por_Nodo_Cu') {
            valores.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      this.graficoDesbalancePorNodoCu(valores, this.limites[2].value);

      //Factor Desbalance Global
      const f: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === 'Factor_Desbalance_Global_Cu') {
            fdesbalanceglobal.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      this.graficoDesbalanceGlobal(fdesbalanceglobal, this.limites[3].value);

      //Incertidumbre
      const inc: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === 'Incertidumbre_Dato_Base_Cu') {
            incertidumbre.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      this.graficoIncertidumbreDatosBases(incertidumbre, this.limites[4].value);

      //Nro Ejecuciones
      const neje: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === 'Nro_Ejecuciones') {
            nejecuciones.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      this.graficoNroEjecuciones(nejecuciones, this.limites[5].value);

      //SobreAjuste
      const sobre: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === '%Sobreajuste') {
            sobreajus.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      this.graficoSobreajuste(sobreajus, this.limites[1].value);

      //Ajuste de Inventario %
      const aju: any = items.map((v: any) => {
        values: v.values.map((x: any, ind: number) => {
          if (v.attributes[ind] === '%Ajuste_Inventarios_Cu') {
            ajuste.push({
              element: v.element,
              value: x
            })
          }
        })
      })

      this.graficoAjusteInventario(ajuste, this.limites[0].value);

    });


  }

  graficoAjusteInventario(data: any, limite: number): void {
    const info: any = this._service.getDataGraficoDesbalancePorNodo(data, 6, `AJUSTE`, ' INVENTARIOS ( % )', '( % )', limite, true);
    setTimeout(() => {
      this.ajusteinventario = this.objects.getSimpleColumnChart(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoSobreajuste(data: any, limite: number): void {
    const info: any = this._service.getDataGraficoDesbalancePorNodo(data, 5, `SOBREAJUSTE`, ' ( % )', '( % )', limite, true);
    setTimeout(() => {
      this.sobreajuste = this.objects.getSimpleColumnChart(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoNroEjecuciones(data: any, limite: number): void {
    const info: any = this._service.getDataGraficoDesbalancePorNodo(data, 4, `NÚMERO`, ' EJECUCIONES ( N° VECES )', '( N° VECES )', limite, true);
    setTimeout(() => {
      this.nroejecuciones = this.objects.getSimpleColumnChart(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoIncertidumbreDatosBases(data: any, limite: number): void {
    const info: any = this._service.getDataGraficoDesbalancePorNodo(data, 3, `INCERTIDUMBRE`, ' DATOS BASE ( % )', '( % )', limite, true);
    setTimeout(() => {
      this.incertidumbre = this.objects.getSimpleColumnChart(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDesbalanceGlobal(data: any, limite: number): void {
    const info: any = this._service.getDataGraficoDesbalancePorNodo(data, 2, `FACTOR`, ' DESBALANCE GLOBAL ( - )', '( - )', limite, true);
    setTimeout(() => {
      this.desbalanceglobal = this.objects.getSimpleColumnChart(info);
      this.updateFlag = true;
    }, 2000);
  }

  graficoDesbalancePorNodoCu(data: any, limite: number): void {
    const info: any = this._service.getDataGraficoDesbalancePorNodo(data, 1, `DESBALANCE`, ' POR NODO ( % )', '( % )', limite, true);
    setTimeout(() => {
      this.desbalancePorNodo = this.objects.getSimpleColumnChart(info);
      this.updateFlag = true;
    }, 2000);
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

    console.log(body);
    return body;
  }

}
