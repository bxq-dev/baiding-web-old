import {Injectable} from '@angular/core';
import {Resolve, Router} from '@angular/router';
import {ActivatedRouteSnapshot} from '@angular/router';

import {LiveService} from '../api/live/live.service';

@Injectable()
export class LiveInfoResolver implements Resolve<any>{
  constructor(private liveService: LiveService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    let liveId = route.params['id'];
    return this.liveService.getLiveInfo(liveId).then((res)=> {
      return res
    }, ()=> {
      this.router.navigate(['/404']);
      return false
    })

  }
}