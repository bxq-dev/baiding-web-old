import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LiveInfoModel} from "../../../shared/api/live/live.model";
import {UserInfoModel} from "../../../shared/api/user-info/user-info.model";
import {UtilsService} from "../../../shared/utils/utils";

@Component({
  templateUrl: './view-info.component.html',
  styleUrls: ['./view-info.component.scss'],
})

export class ViewInfoComponent implements OnInit {
  liveId: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  isInApp = UtilsService.isInApp;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];
  }

  gotoEdit() {
    this.router.navigate([`lives/${this.liveId}/settings/edit-info`]);
  }
}