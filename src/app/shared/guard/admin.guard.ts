import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {LiveService} from "../api/live/live.service";
import {LiveInfoModel} from "../api/live/live.model";
import {UserInfoModel} from "../api/user-info/user-info.model";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private liveService: LiveService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let liveId = route.params['id'];

    if (!liveId) {
      let parent = route.parent;

      while (parent) {
        liveId = parent.params['id'];
        if (liveId) break;
        parent = parent.parent;
      }

      if (!liveId) {
        this.router.navigate([`/404`]);
        return Promise.resolve(false);
      }
    }

    return Promise.all<LiveInfoModel, UserInfoModel>([this.liveService.getLiveInfo(liveId), this.userInfoService.getUserInfo()]).then((result) => {
      let liveInfo = result[0];
      let userInfo = result[1];

      return liveInfo.isAdmin(userInfo.uid);
    }, (err) => {
      const to = encodeURIComponent(`${location.protocol}//${location.hostname}${state.url}`);
      if (err.status == 404) {
        this.router.navigate([`/404`]);
      } else {
        this.router.navigate([`/reload`], {queryParams: {backTo: to}});
      }
      return false;
    });
  }
}
