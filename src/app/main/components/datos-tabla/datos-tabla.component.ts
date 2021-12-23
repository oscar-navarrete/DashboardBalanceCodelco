import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-tabla',
  templateUrl: './datos-tabla.component.html',
  styleUrls: ['./datos-tabla.component.scss']
})
export class DatosTablaComponent implements OnInit {

  @Input() valores: any[] = [];
  @Input() tituloTabla: string;

  constructor() {
    this.tituloTabla = 'Patio Cátodos';
  }

  ngOnInit() {
  }

}
