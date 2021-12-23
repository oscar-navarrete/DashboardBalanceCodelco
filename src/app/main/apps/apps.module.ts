import { NgModule } from '@angular/core';
import { RouterModule, CanActivate } from '@angular/router';
import { MainDashboardComponent } from './dashboards/main-dashboard/main-dashboard.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { SecurityGuard } from '../guards/security.guard';


const routes = [
  {
    path: 'dashboards/main',
    loadChildren: './dashboards/main-dashboard/main-dashboard.module#MainDashboardModule',
    canActivate: [SecurityGuard],
  },
  {
    path: 'security/accounts',
    loadChildren: './contacts/contacts.module#ContactsModule',
    canActivate: [SecurityGuard],
  },
  {
    path: 'security/my-profile',
    loadChildren: './my-profile/my-profile.module#MyProfileModule',
    canActivate: [SecurityGuard],
  },
  {
    path: 'security/features',
    loadChildren: './security/features/features.module#FeaturesModule',
    canActivate: [SecurityGuard],
  },
  {
    path: 'security/groups',
    loadChildren: './security/groups/groups.module#GroupsModule',
    canActivate: [SecurityGuard],
  },
  {
    path: 'tableros',
    loadChildren: './tableros/tableros.module#TablerosModule',
    canActivate: [SecurityGuard],
  },
  {
    path: 'tableros/dashbalance',
    loadChildren: './tableros/tableros.module#TablerosModule',
    canActivate: [SecurityGuard],
  }

];


@NgModule({
  declarations: [MainDashboardComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule]
})
export class AppsModule { }
