import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {LiveRoomComponent} from './live-room.component';
import {AuthGuard} from '../shared/guard/auth.guard';
import {LiveInfoResolver} from '../shared/guard/live-info.resolver';
import {UserInfoResolver} from '../shared/guard/user-info.resolver';
import {LiveRoomInfoComponent} from "./live-room-info/live-room-info.component";
import {RoleAuthGuard} from "../shared/guard/role-auth.guard";

const route: Routes = [
  {
    path: 'apply',
    loadChildren: 'app/+live-room/+apply/apply.module#ApplyModule',
    data: {
      title: '申请开通话题间权限'
    }
  },
  {
    path: 'create',
    loadChildren: 'app/+live-room/+create/create.module#CreateModule',
    data: {
      title: '新建话题间'
    }
  },
  {
    path: ':id/history', loadChildren: 'app/+live-room/+history/history.module#HistoryModule'
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [RoleAuthGuard],
        component: LiveRoomComponent,
        data: {
          isAsyncShareInfo: true,
        },
        resolve: {
          liveInfo: LiveInfoResolver,
          userInfo: UserInfoResolver,
        },
      },
      {
        path: 'info',
        component: LiveRoomInfoComponent,
        resolve: {
          liveInfo: LiveInfoResolver,
          userInfo: UserInfoResolver,
        },
      },
      {path: 'push-comment', loadChildren: 'app/+live-room/+push-comment/push-comment.module#PushCommentModule'},
      {path: 'post', loadChildren: 'app/+live-room/+post/post.module#PostModule'},
      {path: 'vip-info', loadChildren: 'app/+live-room/+vip-info/vip-info.module#VipInfoModule'},
      {path: 'stream-info', loadChildren: 'app/+live-room/+stream-info/stream-info.module#StreamInfoModule'},
      {path: 'invitation', loadChildren: 'app/+live-room/+invite/invite.module#InviteModule'},
      {path: 'share/:message_id', loadChildren: 'app/+live-room/+share/share.module#ShareModule'},
      {path: 'settings', loadChildren: 'app/+live-room/+settings/settings.module#SettingsModule'},
    ]
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class LiveRoomRoutingModule {
}
