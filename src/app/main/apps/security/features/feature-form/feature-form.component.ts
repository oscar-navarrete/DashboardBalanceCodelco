import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Feature, FeatureGroup } from 'app/main/models/security.model';
import {MatChipInputEvent} from '@angular/material/chips';
import { FeaturesService } from '../features.service';
import { FeatureListComponent } from '../feature-list/feature-list.component';
import { group } from '@angular/animations';

@Component({
  selector: 'features-feature-form-dialog',
  templateUrl: './feature-form.component.html',
  styleUrls: ['./feature-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeaturesFeatureFormDialogComponent  {

    action: string;
    feature: Feature;
    system: string;
    group: string;
    featureForm: FormGroup;
    dialogTitle: string;
    disabled = false;
    groups: any[] = [];

    visible = true;
    selectable = true;
    removable = true;

    constructor(
        public matDialogRef: MatDialogRef<FeaturesFeatureFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _dataService: FeaturesService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Editar Característica';
            this.feature = _data.record;
            if (typeof this.feature.groups === 'string') {
                for (const g of this.feature.groups.replace(/\s/g, '').split(',')) {
                    if (g !== '') {
                        const group = {
                            id: g,
                            name: _dataService.recordGroups.find( (_group: FeatureGroup) => _group.id === g ).name
                        };   
                        this.groups.push(group);
                    }
                }
            }
            
            this.disabled = true;
            this.feature.system = _data.system;
            this.feature.group = _data.group;
        }
        else
        {
            this.dialogTitle = 'Nueva Característica';
            this.feature = new Feature({});
            this.feature.system = _data.system;
            this.feature.group = _data.group;
        }

        this.featureForm = this.createFeatureForm();

    }

    remove(group: any): void {
        const data = {
            group: group.id,
            feature: this.feature.id,
            checked: false
        };
        this._dataService.actionGroup(data);
        const index = this.groups.indexOf(group);
        if (index >= 0) {
          this.groups.splice(index, 1);
        }
        this._dataService.getFeatures();
      }

    createFeatureForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.feature.id],
            name    : [this.feature.name],
            title   : [this.feature.title],
            icon    : [this.feature.icon],
            route   : [this.feature.route],
            system   : [this.feature.system],
            group   : [this.feature.group],
            description   : [this.feature.description]
        });
    }
}
