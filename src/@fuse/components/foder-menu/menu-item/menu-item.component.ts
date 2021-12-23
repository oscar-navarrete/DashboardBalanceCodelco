import { Component, Input, OnInit, ViewChild } from '@angular/core';
 
@Component({
    selector   : 'menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls  : ['./menu-item.component.scss']
})
export class MenuItemComponent{

    @Input() items = [];
    @ViewChild('childMenu',{static:true}) public childMenu;

    constructor(){
    }
}
