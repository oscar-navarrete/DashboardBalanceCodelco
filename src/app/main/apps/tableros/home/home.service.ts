import { Injectable } from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  cols: number = 4;
  configColumns: any = {};

  constructor() { }

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



}
