import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Routes, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {LiveService} from "../api/live/live.service";
import {host} from "../../../environments/environment";

@Injectable()
export class RoleAuthGuardRedBook implements CanActivate {

  constructor(private userInfoService: UserInfoService, private liveService: LiveService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const liveId = route.parent.params['id'];

    return this.liveService.getLiveInfo(liveId).then(liveInfo => {
      return true;
    }, (err) => {
      const to = `${host.self}${state.url}`;
      if (err.status === 404) {
        this.router.navigate([`/404`]);
      } else if (err.status !== 401) {
        this.router.navigate([`/reload`], {queryParams: {redirectTo: to}});
      }
      return false;
    });
  }
}

