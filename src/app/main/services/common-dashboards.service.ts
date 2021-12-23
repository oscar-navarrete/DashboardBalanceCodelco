import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommonDashboardsService {

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  datePickerCtrl = new FormControl((new Date()).toISOString());
  fecha: any;
  chartColors: any = ['#eca31c', '#00788b'];

  constructor(private dateAdapter: DateAdapter<any>) {
    this.dateAdapter.setLocale('es');
    console.log(this.datePickerCtrl);
  }

  public generateBody(date, dsCode, queryCode): any {
    const now = moment(date);
    const initTime = now.clone().weekday(1).format('YYYY-MM-DD');
    const endTime = now.clone().weekday(7).format('YYYY-MM-DD');
    const body = {
      time: moment(date).format('YYYY-MM-DD'),
      initTime, endTime,
      dsCode,
      queryCode
    };
    return body;
  }

  public buildData(data: any, items: any) {
    const structure = data[items[0]].Content.Items;

    let returnData: any = {};
    const _data = {
      Content: {
        Items: data[items[1]].Content.Items.map((d: any, index: number) => {
          return {
            Name: structure[index].Name,
            Path: structure[index].Path,
            // Value: {
            //   Value: d.Content.Value,
            //   Timestamp: d.Content.Timestamp,
            //   UnitsAbbreviation: d.Content.UnitsAbbreviation
            // },
            UnitsAbbreviation: d.Content.UnitsAbbreviation,
            Items: d.Content.Items
          }
        })
      }
    }
    returnData[items[0]] = _data;
    return returnData;
  }

  public buildDataNoItems(data: any, items: any) {
    const structure = data[items[0]].Content.Items;
    let returnData: any = {};
    const _data = {
      Content: {
        Items: data[items[1]].Content.Items.map((d: any, index: number) => {
          return {
            Name: structure[index].Name,
            Path: structure[index].Path,
            Value: {
              Value: d.Content.Value,
              Timestamp: d.Content.Timestamp,
              UnitsAbbreviation: d.Content.UnitsAbbreviation
            },
            UnitsAbbreviation: d.Content.UnitsAbbreviation,
            // Items: d.Content.Items
          }
        })
      }
    }
    returnData[items[0]] = _data;
    // console.log(returnData);
    return returnData;
  }




  public round(numero, decimales): any {
    if (typeof numero === 'object') {
      return undefined;
    }
    const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
    if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
      return Number(numero.toFixed(decimales));
    } else {
      // tslint:disable-next-line: max-line-length
      return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    }
  }

  escapeRegExp(value: string): string {
    return value.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  replaceAll(str, find, replace): string {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  public getCategoriesByItemsByDate(data: any, name: string, position: number = 0, dateFormat: string = 'DD-MM-YYYY'): any {
    const mapData: any = data[name]['Content']['Items'][0].Items;
    console.log(name);
    console.log(mapData);
    const categories: any = mapData
      .map((d: any) => {
        return { date: moment(d.Timestamp).format(dateFormat) };
      })
      .map(JSON.stringify).reverse()

      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse)
      .map((d: any) => d.date);

    return categories;
  }

  public getCategoriesByItemsByName(data: any, name: string, position: number = 0): any {
    const _series: any = data[name]['Content']['Items']
      .map((d: any) => {
        let pos: number = position;
        if (pos === -1) {
          // pos = d['Path'].split('|')[position].split('\\').length - 1;
          pos = d['Path'].split('|').length - 1
        }
        return {
          name: d['Path'].split('|')[pos].split('\\')[d['Path'].split('|')[pos].split('\\').length - 1]
        };
      }).map(JSON.stringify).reverse()
      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse);

    console.log(_series);
    return _series;
  }

  transformDataInCategorySerieValue(data: any, id: any, config: any): any {
    // Transforma los datos en una estructura del tipo Categoria, Serie, Valor
    const mapData: any = data[id]['Content']['Items'].map((d: any) => {
      let serie = config.realName;
      if (d['Path'].split('|')[d['Path'].split('|').length - 1] === 'Target') {
        serie = config.targetName;
      }
      return {
        category: d['Path'].split('|')[0].split('\\')[d['Path'].split('|')[0].split('\\').length - 1],
        serie,
        value: d['Value']['Value']
      };
    });
    return mapData;
  }

  getDataTable(data: any, name: string, position: number = 0): any {

    const pos = position;

    const config = [{ field: 'Fecha', headerName: 'Fecha', flex: 1, sortable: true }];
    const _config: any = this.getCategoriesByItemsByName(data, name, pos).map((d: any) => {
      let field = this.replaceAll(d.name, ' ', '');
      field = this.replaceAll(field, '.', '');
      field = this.replaceAll(field, '-', '');
      field = this.replaceAll(field, '(', '');
      field = this.replaceAll(field, ')', '');
      return { field, headerName: d.name, flex: 1, sortable: true };
    });
    config.push(..._config);



    const mapData: any = data[name]['Content']['Items']
      .map((d: any) => {
        let pos: number = position;
        if (pos === -1) {
          // pos = d['Path'].split('|')[position].split('\\').length - 1;
          pos = d['Path'].split('|').length - 1
        }
        return {

          name: d['Path'].split('|')[pos].split('\\')[d['Path'].split('|')[pos].split('\\').length - 1],
          value:
            d['Items'].map((d: any) => {
              return {
                date: moment(d.Timestamp).format('DD-MM-YYYY'),
                value: d.Value
              }
            })
        };
      })
      .map((item: any) => {
        var result = [];
        item.value.reduce((res: any, value: any) => {
          if (!res[value.date]) {
            res[value.date] = { date: value.date, value: 0 };
            result.push(res[value.date])
          }
          res[value.date].value += value.value;
          return res;
        }, {});

        return {
          name: item.name,
          values: result
        }
      });

    const categories = this.getCategoriesByItemsByDate(data, name);

    let dataTable: any = [];
    let _datos: any = {};

    for (const item of categories) {
      _datos = [];
      for (let index = 0; index < config.length; index++) {
        const field = config[index].field;
        if (field !== 'Fecha') {
          const valor = mapData
            .filter((d: any) => {
              let _field = this.replaceAll(d.name, ' ', '');
              _field = this.replaceAll(_field, '.', '');
              _field = this.replaceAll(_field, '-', '');
              _field = this.replaceAll(_field, '(', '');
              _field = this.replaceAll(_field, ')', '');
              return _field === field;
            })[0].values
            .filter((d: any) => {
              return item === d.date;
            });
          if (valor !== undefined) {
            _datos[field] = this.round(valor[0].value, 0);
          }
        }
        if (field === 'Fecha') {
          _datos[field] = item;
        }
      }
      dataTable.push(_datos);
    }
    return {
      config,
      dataTable
    };
  }


  public getSeriesByItems(data: any, name: string, type: string = 'scatter', types: any = [], position: number = 0): any {
    const mapData: any = data[name]['Content']['Items']
      .map((d: any) => {
        let pos: number = position;
        if (pos === -1) {
          // pos = d['Path'].split('|')[position].split('\\').length - 1;
          pos = d['Path'].split('|').length - 1
        }
        return {
          name: d['Path'].split('|')[pos].split('\\')[d['Path'].split('|')[pos].split('\\').length - 1],
          value:
            d['Items'].map((d: any) => {
              return {
                date: moment(d.Timestamp).format('DD-MM-YYYY'),
                value: (typeof d.Value === 'number') ? d.Value : null
              }
            })
        };
      })
      .map((item: any) => {
        var result = [];
        item.value.reduce((res: any, value: any) => {
          if (!res[value.date]) {
            res[value.date] = { date: value.date, value: 0 };
            result.push(res[value.date])
          }
          res[value.date].value += value.value;
          return res;
        }, {});

        return {
          name: item.name,
          values: result
        }
      });

    const _series: any = data[name]['Content']['Items']
      .map((d: any) => {
        let pos: number = position;
        if (pos === -1) {
          // pos = d['Path'].split('|')[position].split('\\').length - 1;
          pos = d['Path'].split('|').length - 1
        }
        return {
          name: d['Path'].split('|')[pos].split('\\')[d['Path'].split('|')[pos].split('\\').length - 1]
        };
      }).map(JSON.stringify).reverse()
      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse);
    const series: any = [];
    let i = 0;

    for (const serie of _series) {
      let __type: string;
      const _type: any = types.filter((d: any) => {
        return d.serie === serie.name;
      })[0];
      __type = type;
      if (_type !== undefined) {
        __type = _type.type;
      }
      series.push({
        name: serie.name,
        type: __type,
        data: mapData
          .filter((d: any) => { return d.name === serie.name; })
          .map((d: any) => {
            return d.values.map((item: any) => {
              if (typeof item.value === 'number') {
                return this.round(item.value, 0);
              } else {
                return item.value;
              }
            });
          })[0]
      });
    }
    return series;
  }

  public getUnionItems(data: any, items: any) {
    const itemsReturn: any = [];
    for (const item of items) {
      if (data[item]['Content']['Items']) {
        let arrayData: any = data[item]['Content']['Items'];

        for (const i of arrayData) {
          itemsReturn.push(i);
        }
      };
    }
    return itemsReturn;
  }


  public getPieData2(data: any, name: string, position: number = 0): any {
    const _series: any = data[name]['Content']['Items']
      .map((d: any) => {
        let pos: number = position;
        if (pos === -1) {
          // pos = d['Path'].split('|')[position].split('\\').length - 1;
          pos = d['Path'].split('|').length - 1
        }
        return {
          name: d['Path'].split('|')[pos].split('\\')[d['Path'].split('|')[pos].split('\\').length - 1],
          y: this.round(data[name].Content.Items[0].Value.Value, 0)
        };
      });
    return _series;
  }


  getPieData(data: any, id: string, position: number = 0): any {

    let series = this.getPieData2(data, id, position);

    // let series: any = [
    //   {
    //     name: data[id].Content.Items[0].Name,
    //     color: this.chartColors[0],
    //     y: this.round(data[id].Content.Items[0].Value.Value , 0)
    //   },
    //   {
    //     name: data[id].Content.Items[1].Name,
    //     color: this.chartColors[1],
    //     y: this.round(data[id].Content.Items[1].Value.Value , 0)
    //   }
    // ];

    series = [{ data: [...series] }]

    return series;
  }

  getGaugeConfig(data: any, id: any, config: any): any {
    const values = this.getGaugeData(data, id, config);
    return {
      title: config.title,
      subtitle: config.subtitle,
      um: config.um,
      values,
      stops: [
        [0.1, '#DF5353'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#55BF3B'] // red
      ]
    };
  }

  getGaugeData(data: any, id: string, config: any): any {
    const real: any = data[id].Content.Items.filter((d: any) => {
      return d['Path'].split('|')[d['Path'].split('|').length - 1] !== 'Target';
    })[0]['Value']['Value'];
    const target: any = data[id].Content.Items.filter((d: any) => {
      return d['Path'].split('|')[d['Path'].split('|').length - 1] === 'Target';
    })[0]['Value']['Value'];
    return {
      real,
      target,
      min: config.min || 0,
      max: config.max || 100
    };
  }

  getDataCategoriesRealTarget(data: any, id: any, config: any): any {
    let mapData: any;
    if (config.transform) {
      mapData = this.transformDataInCategorySerieValue(data, id, config);
    } else {
      mapData = data
        .map((d: any) => {
          return {
            category: d['Path'].split('|')[0].split('\\')[d['Path'].split('|')[0].split('\\').length - 1],
            serie: (d['Path'].split('|')[2] === undefined) ? d['Path'].split('|')[1] : d['Path'].split('|')[2],
            fecha: moment(d['Value']['Timestamp']).format('DD-MM-YYYY'),
            value: this.round(d['Value']['Value'], 0)
          }
        });
    }

    const categories: any = mapData
      .map((d: any) => {
        return { category: d.category };
      })
      .map(JSON.stringify).reverse()
      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse);

    const _series: any = mapData
      .map((d: any) => {
        return { name: d.serie };
      })
      .map(JSON.stringify).reverse()
      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse);

    let color = '';
    const series: any = [];
    let i = 0;
    for (const serie of _series) {
      color = this.chartColors[i];
      i++;
      series.push({
        name: serie.name,
        color,
        data: mapData.filter((d: any) => {
          return d.serie === serie.name;
        }).map((d: any) => {
          return this.round(d.value, 0);
        }),
        pointPlacement: 'on'
      });
    }

    const returnData: any = {
      categories: categories.map((d: any) => d.category),
      series,
      title: config.title,
      subtitle: config.subtitle || ''
    };

    return returnData;
  }



  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  getDistinctItemsByTagName(data: any): any {
    const distinct: any = data
      .map((d: any) => {
        return {
          name: d['Name']
        };
      }).map(JSON.stringify).reverse()
      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse)
      .sort(this.GetSortOrder('name'));
    return distinct;
  }

  getDistinctItemsByTimestamp(data: any, dateFormat: string = ''): any {
    const records: any = [];
    for (const item of data) {
      if (item['Items']) {
        let arrayData: any = item['Items'];
        for (const i of arrayData) {
          records.push(i);
        }
      };
    }
    let distinct: any = records
      .map((d: any) => {
        return {
          timestamp: (dateFormat === undefined || dateFormat === null || dateFormat === '') ? d['Timestamp'] : moment(d['Timestamp']).format(dateFormat)
        }
      })
      .map(JSON.stringify).reverse()
      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse)
      .sort(this.GetSortOrder('name'));
    return distinct;
  }

  getDistinctItemsByPath(data: any, split1: string, position1: number, split2: string, position2: number): any {
    const distinct: any = data
      .map((d: any) => {
        return {
          name: d['Path'].split(split1)[position1],
        };
      })
      .map((d: any) => {
        return {
          name: (position2 === -1) ? d['name'].split(split2)[d['name'].split(split2).length - 1] : d['name'].split(split2)[position2],
        };
      })
      .map(JSON.stringify).reverse()
      .filter((item, index, arr) => arr.indexOf(item, index + 1) === -1)
      .reverse().map(JSON.parse)
      .sort(this.GetSortOrder("name"));
    return distinct;
  }

  generateTable001(records: any): any {
    /*
    Esta tabla selecciona los datos:
      Filas = Nombre del Item = proviene del tag Name de la estructura JSON
      Columnas = Obtenidas dinamicamente desde el tag Path. 1ª posición del split | y ultimo elemento del split \
      No muestra la fecha porque asume que los datos son para una fecha especifica
    */
    const items: any = this.getDistinctItemsByTagName(records);
    const cols: any = this.getDistinctItemsByPath(records, '|', 0, '\\', -1);
    const tableData: any = this.getColumnsTable(records, items, cols, 2);
    return tableData;
  }

  generateTable002(records: any, dateFormat: string = ''): any {
    /*
    Esta tabla selecciona los datos:
      Filas = Fecha como primer campo
      Columnas = Obtenidas dinamicamente desde el tag Path. 1ª posición del split | y ultimo elemento del split \
    */
    const items: any = this.getDistinctItemsByTimestamp(records, dateFormat);
    const cols: any = this.getDistinctItemsByPath(records, '|', 0, '\\', -1);
    const tableData: any = this.getColumnsTableByTimestamp(records, items, cols, 2, dateFormat);
    return tableData;
  }

  getColumnsTableByTimestamp(data: any, items: any, cols: any, round: number, dateFormat: string = '') {
    const records: any = [];

    for (const item of data) {
      for (const value of item.Items) {
        records.push({
          name: item.Name,
          path: item.Path,
          timestamp: (dateFormat === undefined || dateFormat === null || dateFormat === '') ? value.Timestamp : moment(value.Timestamp).format(dateFormat),
          value: value.Value
        });
      }
    }

    const itemsTbl: any = [];
    for (const item of items) {
      let i: any = {
        timestamp: item.timestamp
      };
      for (const col of cols) {
        const value = records.filter((d: any) => {
          return d.timestamp === item.timestamp && d.path.indexOf(col.name) !== -1;
        });
        i[this.replaceAll(this.replaceAll(col.name, ' ', ''), '.', '')] = (value.length > 0) ? this.round(value[0].value, round) : '-';
      }
      itemsTbl.push(i);
    }
    return itemsTbl;
  }

  getColumnsTable(data: any, items: any, cols: any, round: number) {
    const itemsTbl: any = [];
    for (const item of items) {
      let i: any = {
        item: item.name
      };
      for (const col of cols) {
        const value = data.filter((d: any) => {
          return d.Name === item.name && d.Path.indexOf(col.name) !== -1;
        });
        i[this.replaceAll(this.replaceAll(col.name, ' ', ''), '.', '')] = (value.length > 0) ? this.round(value[0].Value.Value, round) : '-';
      }
      itemsTbl.push(i);
    }
    return itemsTbl;
  }

}
