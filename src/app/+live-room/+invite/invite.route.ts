import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {InviteComponent} from './invite.component';
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";

const route: Routes = [
  {
    path: '', component: InviteComponent,
    resolve: {
      userInfo: UserInfoResolver,
      liveInfo: LiveInfoResolver,
    },
    data: {
      title: '邀请嘉宾'
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class InviteRoutingModule {}