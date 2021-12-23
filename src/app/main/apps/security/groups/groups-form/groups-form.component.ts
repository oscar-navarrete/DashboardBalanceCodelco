import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Feature, UserGroup } from 'app/main/models/security.model';
import { GroupsService } from '../groups.service';


@Component({
  selector: 'groups-group-form-dialog',
  templateUrl: './groups-form.component.html',
  styleUrls: ['./groups-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GroupsGroupFormDialogComponent {
  action: string;
  feature: Feature;
  system: string;
  group: UserGroup;

  groupForm: FormGroup;
  dialogTitle: string;
  disabled = false;
  features: any[] = [];
  users: any[] = [];

  visible = true;
  selectable = true;
  removable = true;

  eventImport = {};
  returnJSON = true;

  constructor(
      public matDialogRef: MatDialogRef<GroupsGroupFormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private _dataService: GroupsService
  )
  {

      this.eventImport = {
        onImport: this.onImport
      }

      // Set the defaults
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Editar Grupo';
          this.group = _data.record;
          // if (typeof this.feature.groups === 'string') {
          //     for (const g of this.feature.groups.replace(/\s/g, '').split(',')) {
          //         if (g !== '') {
          //             const group = {
          //                 id: g,
          //                 name: _dataService.recordGroups.find( (_group: FeatureGroup) => _group.id === g ).name
          //             };   
          //             this.groups.push(group);
          //         }
          //     }
          // }
          
          this.disabled = true;
          
      }
      else
      {
          this.dialogTitle = 'Nuevo Grupo';
          this.group = new UserGroup({});
      }

      this.groupForm = this.createForm();

  }

  onImport(result: any): void {
    console.log('Resultado: ===> ' , result);
  }
  // remove(group: any): void {
  //     const data = {
  //         group: group.id,
  //         feature: this.feature.id,
  //         checked: false
  //     };
  //     this._dataService.actionGroup(data);
  //     const index = this.groups.indexOf(group);
  //     if (index >= 0) {
  //       this.groups.splice(index, 1);
  //     }
  //     this._dataService.getFeatures();
  //   }

    createForm(): FormGroup
  {
      return this._formBuilder.group({
          id          : [this.group.id],
          name        : [this.group.name],
          description : [this.group.description],
          members     : [this.group.members],
          enabled     : [this.group.enabled],
      });
  }
}
