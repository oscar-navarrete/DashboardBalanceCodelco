import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { fuseAnimations } from '../../../../@fuse/animations/index';

@Component({
  selector: 'app-dash-title',
  templateUrl: './dash-title.component.html',
  styleUrls: ['./dash-title.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DashTitleComponent implements OnInit {

  @Input() title = '';
  @Input() icon = 'dashboard';
  constructor() { }

  ngOnInit() {
  }

}
