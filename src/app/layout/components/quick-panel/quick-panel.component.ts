import { Component, ViewEncapsulation } from '@angular/core';
import { NotificationsService } from '../../../main/services/notifications.service';
import { fuseAnimations } from '../../../../@fuse/animations/index';
import * as moment from 'moment';
import {ThemePalette} from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface ChipColor {
  name: string;
  color: ThemePalette;
}

@Component({
    selector     : 'quick-panel',
    templateUrl  : './quick-panel.component.html',
    styleUrls    : ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
})
export class QuickPanelComponent
{
    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    bodyHtml:any;

    /**
     * Constructor
     */
    constructor(public _notifications: NotificationsService,private sanitizer: DomSanitizer)
    {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud : false,
            retro : true
        };
    }

    sanitize(_html){
        return this.sanitizer.bypassSecurityTrustHtml(_html);
    }

    viewDate(date: string): any {
        return moment(date).locale('es-us').fromNow();
    }


    markToReaded(message): void {
        this._notifications.agreed(message).then ( (response) => {
            if (!response.data.response.ok) {
                return;
            }
        });
    }
}
