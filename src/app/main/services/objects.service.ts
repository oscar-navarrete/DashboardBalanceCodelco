import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonDashboardsService } from './common-dashboards.service';
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {
  // highcharts = Highcharts;
  // Highcharts: typeof Highcharts = Highcharts;

  constructor(private common: CommonDashboardsService) { }

  // private round(numero, decimales): any {
  //   const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
  //   if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
  //       return Number(numero.toFixed(decimales));
  //   } else {
  //       // tslint:disable-next-line: max-line-length
  //       return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
  //   }
  // }

  getGaugue(data: any): any {

    const gaugeOptions = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: null,
      },
      title: {
        text: '<p style="color:white;font-size:12px; font-weight:bold;">' + data.title + '<span style="color:white;font-size:12px; font-weight:bold;">' + data.subtitle + '</span>',
      },
      exporting: {
        enabled: false
      },
      background: null,
      credits: {
        enabled: false
      },
      pane: [{
        startAngle: -120,
        endAngle: 120,
        center: ['50%', '50%'],
        background: null,
      }, {
        startAngle: -100,
        endAngle: 100,
        center: ['50%', '65%'],
        background: null
      }],
      yAxis: [{
        min: 0,
        max: 100,
        lineColor: null,
        minorTickInterval: 'auto',
        minorTickWidth: 0,
        minorTickLength: 0,
        minorTickPosition: 'outside',
        minorTickColor: '#fff',
        tickPixelInterval: '30',
        tickWidth: 0,
        tickLength: 0,
        tickPosition: 'inside',
        tickColor: '#fff',
        labels: {
          step: 4,
          distance: -33,
          useHTML: true,
          style: {
            fontFamily: 'Roboto',
            fontWeight: '400',
            fontSize: '22px',
            textShadow: '0',
            color: 'white' //'#aaaaaa'
          }
        },
        title: {
          text: null
        },
        plotBands: data.plotbands
      }, {
        pane: 1,
        min: 0,
        max: 100,
        labels: {
          enabled: false
        },
        tickWidth: 0,
        tickLength: 0,
        minorTickWidth: 0,
        minorTickLength: 0,
        lineWidth: 0
      }],
      plotOptions: {
        gauge: {
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function () {
              var mbps = this.y;
              return '<span class="rpGaugeLabel" style="text-align:center;display:block;">' + mbps + '%' + '<span style="font-size:9px;text-align:center;display:block;"></span></span>';
            },
            style: {
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontSize: '23px',
              textShadow: '0',
              color: 'white' //'#666'
            },
            borderColor: 'transparent',
          },
          dial: {
            radius: '95%',
            backgroundColor: '#ccc',
            borderWidth: 0,
            baseWidth: 5,
            topWidth: 1,
            baseLength: '40%', // of radius
            rearLength: '0%'
          },
          pivot: {
            backgroundColor: '#bbb',
            radius: 7
          }
        }
      },
      series: data.series

    };
    //console.log(gaugeOptions);
    return gaugeOptions;

  }

  getGaugueVW(data: any): any {

    const gaugeOptions = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: null,
        marginLeft: 0,
        marginRigth: 0,
        marginBottom: 0,
        spacingTop: 30,
        spacingRight: 0,
        spacingBottom: 0,
        spacingLeft: 0
      },
      title: {
        text: '<p style="color:white;font-size:30px; font-weight:bold;">' + data.title + '<span style="color:white;font-size:30px; font-weight:bold;">' + data.subtitle + '</span>',
      },
      exporting: {
        enabled: false
      },
      background: null,
      credits: {
        enabled: false
      },
      pane: [{
        startAngle: -120,
        endAngle: 120,
        center: ['50%', '50%'],
        background: null,
      }, {
        startAngle: -100,
        endAngle: 100,
        center: ['50%', '65%'],
        background: null
      }],
      yAxis: [{
        min: 0,
        max: 100,
        lineColor: null,
        minorTickInterval: 'auto',
        minorTickWidth: 0,
        minorTickLength: 0,
        minorTickPosition: 'outside',
        minorTickColor: '#fff',
        tickPixelInterval: '30',
        tickWidth: 0,
        tickLength: 0,
        tickPosition: 'inside',
        tickColor: '#fff',
        labels: {
          step: 4,
          distance: -33,
          useHTML: true,
          style: {
            fontFamily: 'Roboto',
            fontWeight: '400',
            fontSize: '22px',
            textShadow: '0',
            color: 'white' //'#aaaaaa'
          }
        },
        title: {
          text: null
        },
        plotBands: data.plotbands
      }, {
        pane: 1,
        min: 0,
        max: 100,
        labels: {
          enabled: false
        },
        tickWidth: 0,
        tickLength: 0,
        minorTickWidth: 0,
        minorTickLength: 0,
        lineWidth: 0
      }],
      plotOptions: {
        gauge: {
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function () {
              var mbps = this.y;
              return '<span class="rpGaugeLabel" style="text-align:center;display:block;">' + mbps + '%' + '<span style="font-size:9px;text-align:center;display:block;"></span></span>';
            },
            style: {
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontSize: '30px',
              textShadow: '0',
              color: 'white' //'#666'
            },
            borderColor: 'transparent',
          },
          dial: {
            radius: '95%',
            backgroundColor: '#ccc',
            borderWidth: 0,
            baseWidth: 5,
            topWidth: 1,
            baseLength: '40%', // of radius
            rearLength: '0%'
          },
          pivot: {
            backgroundColor: '#bbb',
            radius: 7
          }
        }
      },
      series: data.series

    };
    //console.log(gaugeOptions);
    return gaugeOptions;

  }

  /** GR-001 -- Grafico de Gauge */
  getSolidGauge(data: any): any {
    /*
    data = {
      title: 'Sólidos Cancha',
      subtitle: 'Promedio Semanal',
      um: '%',
      values: {
        real: 74,
        target: 67,
        min: 0,
        max: 100
      },
      stops: [
        [0.1, '#DF5353'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#55BF3B'] // red
      ]
    }
    */
    const gaugeOptions = {
      chart: {
        type: 'solidgauge'
      },
      credits: {
        enabled: false
      },
      title: {
        text: data.title,
        style: {
          fontSize: '20px'
        }
      },
      tickAmount: data.tickAmount,
      // labels: data.labels,
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      exporting: {
        enabled: false
      },
      tooltip: {
        enabled: true
      },
      // the value axis
      yAxis: {
        stops: data.stops || [],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -110,
          text: data.subtitle
        },
        labels: {
          y: 16,
          distance: 18
        },
        min: data.values.min,
        max: data.values.max,
        tickPositions: [0, this.common.round(data.values.target, 0)]
      },

      plotOptions: {
        size: data.size,
        solidgauge: {
          dataLabels: {
            y: -15,
            borderWidth: 0,
            useHTML: true
          }
        }
      },
      series: [

        {
          name: data.subtitle,
          data: [this.common.round(data.values.real, 0)],
          dial: {
            radius: '100%',
            baseWidth: 1,
            rearLength: '20%'
          },
          dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:black">{y}</span><br/>' +
              '<span style="font-size:12px;color:silver">%</span></div>'
          },
          tooltip: {
            valueSuffix: ' ' + data.um
          }
        },
        {
          type: 'gauge',
          data: [this.common.round(data.values.target, 0)],
          dial: {
            radius: '100%',
            backgroundColor: 'silver',
            borderColor: 'black',
            borderWidth: 1,
            baseWidth: 10,
            topWidth: 1,
            baseLength: '90%', // of radius
            rearLength: '-50%'
          },
          dataLabels: {
            enabled: false
          }
        }]
    };
    return gaugeOptions;

  }

  /** GR-002 -- Grafico de Araña */
  getSpiderChart(data: any): any {

    /*
    data = {
      title: 'Titulo',
      subtitle: 'Sub-titulo',
      categories: ['cat 1', 'cat2', 'cat 3'],
      series: [
        {name: 'Serie 1', color: '#d434d3', pointPlacement: 'on', data: [4, 5, 3]},
        {name: 'Serie 2', color: '#a94f34', pointPlacement: 'on', data: [3, 1, 7]},
      ]
    }
    */
    const chart = {
      chart: {
        polar: true,
        type: 'line'
      },
      title: {
        text: data.title,
        // x: -80
      },
      subtitle: {
        text: data.subtitle
      },
      pane: {
        size: '90%'
      },

      xAxis: {
        categories: data.categories,
        tickmarkPlacement: 'on',
        lineWidth: 0
      },

      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0
      },
      credits: {
        enabled: false
      },

      tooltip: {
        shared: true,
        pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
      },

      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },

      series: data.series,
      exporting: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal'
            },
            pane: {
              size: '70%'
            }
          }
        }]
      }
    };
    return chart;
  }

  /** GR-003 -- Grafico Simple de Columnas */
  getSimpleColumnChart(data: any): any {
    // 'Cantidad de Quiebres al Plan: 17'
    /*
    data = {
      title: 'Titulo',
      subtitle: 'Sub-titulo',
      categories: ['cat1',
                   'cat2',
                   'cat3'],
      series: [
        {name: 'Serie 1', color: '#d434d3', data: [4, 5, 3]},
        {name: 'Serie 2', color: '#a94f34', data: [3, 1, 7]},
      ]
    };
    */
    const chart = {
      chart: {
        type: 'column',
        backgroundColor: "rgba(0,0,0,0)",
      },
      credits: {
        enabled: false
      },
      title: {
        text: '<p style="color:white;font-size:12px; font-weight:bold;">' + data.title + '<span style="color:white;font-size:12px; font-weight:bold;">' + data.subtitle + '</span>'
      },
      colors: ['#E55302'],
      exporting: {
        enabled: false
      },
      subtitle: {
        text: null
      },
      xAxis: {
        categories: data.categories,
        crosshair: true,
        labels: {
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: data.yAxis,
          style: {
            fontWeight: 'bold',
            fontSize: '12px',
            color: 'white'
          }
        },
        plotLines: [{
          value: data.limite,
          zIndex: 5,
          color: 'blue',
          width: 2.5,
          label: {
            formatter: function () {
              return this.options.value;
            },
            text: '',
            align: 'center',
            style: {
              color: 'blue',
              fontWeight: 'bold'
            }
          }
        }],
        labels: {
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      legend: {
        enabled: data.legenda,
        itemStyle: {
          color: 'white',
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true
          }
        },
        series: {
          dataLabels: {
            style: {
              color: 'white'
            }
          }
        }
      },
      series: data.series,

      // exporting: {
      //   showTable: false,
      //   enabled: false
      // },

    };
    return chart;

  }

  /** GR-003 -- Grafico Simple de Columnas */
  getSimpleColumnChartVW(data: any, wi: string, he: string): any {
    // 'Cantidad de Quiebres al Plan: 17'
    /*
    data = {
      title: 'Titulo',
      subtitle: 'Sub-titulo',
      categories: ['cat1',
                   'cat2',
                   'cat3'],
      series: [
        {name: 'Serie 1', color: '#d434d3', data: [4, 5, 3]},
        {name: 'Serie 2', color: '#a94f34', data: [3, 1, 7]},
      ]
    };
    */
    const chart = {
      chart: {
        type: 'column',
        backgroundColor: "rgba(0,0,0,0)",
        width: wi, //'1500'
        height: he, //'600',
        spacingTop: 30,
        fontSize: '30px'

      },
      credits: {
        enabled: false
      },
      title: {
        text: '<p style="color:white;font-size:40px; font-weight:bold;">' + data.title + '<span style="color:white;font-size:40px; font-weight:bold;">' + data.subtitle + '</span>'
      },
      colors: ['#E55302'],
      exporting: {
        enabled: false
      },
      subtitle: {
        text: null
      },
      xAxis: {
        categories: data.categories,
        crosshair: true,
        labels: {
          style: {
            fontWeight: 'bold',
            fontSize: '30px',
            color: 'white'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: data.yAxis,
          style: {
            fontWeight: 'bold',
            fontSize: '30px',
            color: 'white'
          }
        },
        plotLines: [{
          value: data.limite,
          zIndex: 5,
          color: 'blue',
          width: 2.5,
          label: {
            formatter: function () {
              return this.options.value;
            },
            text: '',
            align: 'center',
            style: {
              color: 'blue',
              fontWeight: 'bold'
            },
            fontSize: '30px'
          }
        }],
        labels: {
          style: {
            fontWeight: 'bold',
            fontSize: '30px',
            color: 'white'
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      legend: {
        enabled: data.legenda,
        itemStyle: {
          fontSize: '30px',
          color: 'white',
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true
          }
        },
        series: {
          dataLabels: {
            style: {
              fontSize: '25px',
              color: 'white'
            }
          }
        }

      },
      series: data.series,

      // exporting: {
      //   showTable: false,
      //   enabled: false
      // },

    };
    return chart;

  }

  /** GR-004 -- Grafico de Tortas. */
  getPieChart(data: any): any {
    const chart = {
      chart: {
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: data.title
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: data.subtitle
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: data.um
        }
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: data.size,
          dataLabels: {
            enabled: true,
            connectorShape: 'crookedLine',
            crookDistance: '90%',
            alignTo: 'plotEdges',
            style: {
              fontSize: 12
            },
            format: '<b>{point.name}</b>: {point.y}'

          }
        }
      },
      exporting: {
        enabled: false
      },
      // series: [{
      //   colorByPoint: true,
      //   data: data.series
      // }]
      series: data.series
    };
    return chart;
  }

  /** GR-005 -- Grafico de Dispersión. */
  getScatterChart(data: any): any {
    // const _data = {
    //   title: 'Titulo XXX',
    //   subtitle: 'Subtitulo XXX',
    //   xAxis: { title: 'Periodos' },
    //   yAxis: { title: '%'},
    //   categories: ['10-11-2020', '11-11-2020', '12-11-2020', '13-11-2020'],
    //   series: [{
    //     name: 'Cancha 1',
    //     data: [10, 20, 30, 40]
    //   },
    //   {
    //     name: 'Cancha 2',
    //     data: [11, 24, 35, 31]
    //   },
    //   {
    //     name: 'Cancha 3',
    //     data: [9, 18, 33, 45]
    //   }]
    // };

    const chart = {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: data.title
      },
      subtitle: {
        text: data.subtitle
      },
      credits: {
        enabled: false
      },
      xAxis: {
        title: {
          enabled: true,
          text: data.xAxis.title
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
        categories: data.categories,
      },
      yAxis: {
        title: {
          text: data.yAxis.title
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        // x: 100,
        // y: 70,
        // floating: true,
        backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
        borderWidth: 0
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.y} %'
          }
        }
      },
      series: data.series
    };

    return chart;
  }

  /** GR-006 -- Grafico Area Apilado. */
  getStackedAreaChart(data: any): any {
    const chart = {
      chart: {
        type: 'area',
        // events: data.events,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
      },


      scrollablePlotArea: {
        minWidth: 600
      },
      title: {
        text: data.title
      },
      event: data.event,
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: data.categories,
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      yAxis: data.yAxis,
      tooltip: {
        split: true,
        valueSuffix: ` ${data.um}`
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: (typeof data.legend === 'undefined') ? 'top' : data.legend.verticalAlign
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            enabled: true,
            symbol: 'circle',
            lineWidth: 1,
            lineColor: '#666666'
          }
        },
        series: {
          dataLabels: {
            enabled: true,
            shape: 'square',
            // backgroundColor: 'rgba(0, 0, 0, 0.75)',
            style: {
              color: '#000',
              textOutline: 'none'
            }
          }
        }
      },

      series: data.series
    };
    return chart;
  }

  getStackedChart(data: any): any {
    const chart = {
      chart: {

        events: data.events,
        zoomType: 'x',
        panning: true,

        panKey: 'shift',
      },

      scrollablePlotArea: {
        minWidth: 600
      },
      title: {
        text: data.title
      },
      event: data.event,
      subtitle: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: data.categories,
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      yAxis: data.yAxis,

      tooltip: {
        split: true,
        valueSuffix: ` ${data.um}`
      },

      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: (typeof data.legend === 'undefined') ? 'top' : data.legend.verticalAlign
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            enabled: true,
            symbol: 'circle',
            lineWidth: 1,
            lineColor: '#666666'
          }
        },
        series: {
          dataLabels: {
            enabled: true,
            shape: 'square',
            // backgroundColor: 'rgba(0, 0, 0, 0.75)',
            style: {
              color: '#000',
              textOutline: 'none'
            }
          }
        }
      },

      // series: data.series
    };
    return chart;
  }

  /** GR-007 -- Grafico Columna Apilado Doble Eje. Este es un gráfico especial ya que apila por grupo de valores reales y planes */
  getStackedColumnMultipleYAxisChart(data: any): any {
    const chart = {
      chart: {
        type: 'column'
      },
      title: {
        text: data.title
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: data.subtitle
      },
      xAxis: {
        categories: data.categories,
        crosshair: true
      },
      yAxis: [
        { // Primer Eje
          allowDecimals: false,
          min: 0,
          title: {
            text: data.yAxis[0].title
          }
        },
        { // Segundo Eje
          title: {
            text: data.yAxis[1].title,
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          labels: {
            format: '{value} ' + data.um,
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          opposite: true,
          visible: false
        }],
      tooltip: {
        split: true,
        valueSuffix: ` ${data.um}`
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
        },
        series: {
          dataLabels: {
            enabled: true,
          }
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top'
      },
      series: data.series
    };
    return chart;
  }

  /** GR-008 -- Gráfico de puntos */
  getMarkerPointChart(data: any): any {

    const chart = {
      rangeSelector: {
        selected: 2
      },
      yAxis: data.yAxis,
      title: {
        text: data.title
      },
      credits: {
        enabled: false
      },
      // events: data.events,
      series: data.series
    };
    return chart;
  }



  /** GR-009 -- Gráfico de puntos */
  getLineScaterChart(data: any): any {

    const chart = {

      rangeSelector: {
        selected: 1
      },
      title: {
        text: data.text
      },
      yAxis: data.yAxis,
      credits: {
        enabled: false
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false
          }
        }
      },
      series: [{
        name: data.name,
        data: data.data,
        color: '#FF0000',
        step: true,
        tooltip: {
          valueDecimals: 2
        }
      }]
    };
    return chart;
  }

  /** GR-010 -- Gráfico de puntos */
  getPlotBandsChart(data: any): any {

    const chart = {
      chart: {
        type: 'spline',
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
        }
      },

      xAxis: {
        type: 'datetime',
        labels: {

          x: -10,
          overflow: 'justify'
        }
      },
      legend: {

        align: 'center',
        verticalAlign: 'top',
        x: 15,
        y: 15,
        floating: true,


      },
      yAxis: data.yAxis,
      tooltip: {
        valueSuffix: ' m/s'
      },
      title: {
        text: data.title
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        spline: {
          lineWidth: 5,
          states: {
            hover: {
              lineWidth: 5
            }
          },
          marker: {
            enabled: true
          },
          pointInterval: 3600000, // one hour
          pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
        }
      },


      series: data.series,
      navigation: {
        menuItemStyle: {
          fontSize: '10px'
        }
      }



    };
    return chart;
  }

  /** GR-010 -- Gráfico de puntos */
  getBulletChart(data: any): any {

    const chart = {
      chart: {
        type: 'bar',
        height: 165,
      },
      title: {
        text: data.text
      },

      xAxis: {
        categories: [''],
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        max: 25000,
        title: {

          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },

      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: '',
        data: data.series
      }]

    };
    return chart;
  }

  public graficoLineasIrregularesDobleEje(config: any): any {
    const chart: any = {
      chart: {
        type: 'spline'
      },
      title: {
        text: config.title
      },
      subtitle: {
        text: config.subtitle
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      colors: this.common.chartColors,
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b %H:%M',
          year: '%b'
        },
        title: {
          text: config.xAxisTitle
        },
        crosshair: true
      },
      yAxis: [
        {
          title: {
            text: config.yAxis1Title
          },
          min: 0
        },
        {
          title: {
            text: config.yAxis2Title
          },
          min: 0,
          opposite: true,
        }],
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b %H:%M}: {point.y:.2f}'
      },

      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        },
        line: {
          colorByPoint: true
        }
      },
      legend: {
        verticalAlign: 'top',
        itemStyle: {
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '10px'
        }
      },
      // colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
      series: config.series,
      isResponsiveOptions: true,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            plotOptions: {
              series: {
                marker: {
                  radius: 2.5
                }
              }
            }
          }
        }]
      }
    };
    return chart;
  }

  public getMultiplePieChart(datos: any): any[] {
    const pies: any = [];
    for (const grp of datos) {
      const _data: any[] = [];
      let sliced = true;
      let i = 0;
      for (const item of grp.series) {
        _data.push({
          name: item.name,
          y: item.value,
          color: this.common.chartColors[i],
          sliced,
          selected: sliced
        });
        sliced = false;
        i++;
      }
      const chartData = {
        title: grp.title,
        subtitle: grp.subtitle,
        um: '%',
        series: _data
      };
      pies.push(this.getPieChart(chartData));
    }
    return pies;
  }

  /** GR-003 -- Grafico Simple de Lines */
  getSimpleLineChart(data: any): any {
    // 'Cantidad de Quiebres al Plan: 17'
    /*
    data = {
      title: 'Titulo',
      subtitle: 'Sub-titulo',
      categories: ['cat1',
                   'cat2',
                   'cat3'],
      series: [
        {name: 'Serie 1', color: '#d434d3', data: [4, 5, 3]},
        {name: 'Serie 2', color: '#a94f34', data: [3, 1, 7]},
      ]
    };
    */
    const chart = {
      credits: {
        enabled: false
      },
      title: {
        text: data.title
      },
      subtitle: {
        text: data.subtitle
      },
      xAxis: {
        categories: data.categories,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: data.series,

      exporting: {
        showTable: false,
        enabled: false
      },

    };

    return chart;

  }


}
