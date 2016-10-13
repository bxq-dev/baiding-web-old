import { Routes, RouterModule } from '@angular/router';
import { LiveRoomComponent } from './live-room.component';
import { PostComponent } from './post/post.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { LiveGuard } from '../shared/guard/live.guard';
import { QuitEditGuard } from '../shared/guard/quit-edit.guard';
import {EmptyComponent} from "../shared/empty/empty.component";

const route: Routes = [
  {
    path: 'lives/:id',
    canActivate: [ AuthGuard, LiveGuard ],
    children: [
      {
        path: '',
        component: LiveRoomComponent,
        children: [
          { path: '', component: EmptyComponent},
          { path: 'post', component: PostComponent, canDeactivate: [ QuitEditGuard ]},
        ],
      },
      { path: 'push-comment', loadChildren: 'app/live-room/+push-comment/push-comment.module#PushCommentModule' },
      { path: 'history', loadChildren: 'app/live-room/+history/history.module#HistoryModule' },
      { path: 'invitation', loadChildren: 'app/live-room/+invite/invite.module#InviteModule' },
      { path: 'share/:message_id', loadChildren: 'app/live-room/+share/share.module#ShareModule' }
    ]
  }
]

export const ROUTES = RouterModule.forChild(route);
