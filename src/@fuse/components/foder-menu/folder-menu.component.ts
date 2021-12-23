import { Component, Input, OnInit, ViewChild } from '@angular/core';
 

@Component({
    selector   : 'folder-menu',
    templateUrl: './folder-menu.component.html',
    styleUrls  : ['./folder-menu.component.scss']
})
export class FolderMenuComponent implements OnInit{

    @Input() items = [];

    rootName = 'Laboratorio';

    constructor(){

    }

    ngOnInit(): void{
        console.log(this.items);
    }
}
