import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {UserInfoModel, PermissionModel, UserPublicInfoModel, UserDetailInfoModel} from './user-info.model';
import {StoreService} from '../../store/store.service';
import {environment} from "../../../../environments/environment";

@Injectable()
export class UserInfoService {

  constructor(private http: Http) {
  }

  getUserInfoCache(): UserInfoModel {
    return StoreService.get('userinfo') as UserInfoModel;
  }

  parseUserInfo(data: any): UserInfoModel {
    let info = new UserInfoModel();
    info.nick = data.nick;
    info.username = data.username;
    info.avatar = data.avatar;
    info.uid = data.uid;
    info.permissions = new PermissionModel;
    info.permissions.publish = data.permissions ? data.permissions.publish : false;
    info.isSubscribed = data.isSubscribed ? data.isSubscribed : false;

    return info;

  }

  getUserInfo(needRefresh?: boolean): Promise<UserInfoModel> {
    let userInfoCache = StoreService.get('userinfo') as UserInfoModel;
    if (userInfoCache && !needRefresh) {
      return Promise.resolve(userInfoCache);
    }

    return this.http.get(`${environment.config.host.io}/api/user`).toPromise().then(res => {
      let data = res.json();
      let userInfo = this.parseUserInfo(data);
      StoreService.set('userinfo', userInfo);
      (<any>window).ga('set', 'userId', userInfo.uid); // 登录用户增加ga的userId追踪
      return userInfo;
    });
  }


  getUserPublicInfo(uid: number): Promise<UserPublicInfoModel> {
    return this.http.get(`${environment.config.host.io}/api/user/${uid}`).toPromise()
      .then(res => {
        let data = res.json();
        return this.parseUserPublicInfo(data);
      });
  }

  parseUserPublicInfo(data: any): UserPublicInfoModel {
    let userPublicInfo = new UserPublicInfoModel();

    if (data.uid) userPublicInfo.uid = data.uid;
    if (data.sex) userPublicInfo.sex = data.sex;
    if (data.username) userPublicInfo.username = data.username;
    if (data.nick) userPublicInfo.nick = data.nick;
    if (data.avatar) userPublicInfo.avatar = data.avatar;
    if (data.realName) userPublicInfo.realName = data.realName;
    if (data.country) userPublicInfo.country = data.country;
    if (data.province) userPublicInfo.province = data.province;
    if (data.city) userPublicInfo.city = data.city;
    if (data.intro) userPublicInfo.intro = data.intro;

    return userPublicInfo;

  }

  getUserDetailInfo(): Promise<UserDetailInfoModel> {
    return this.http.get(`${environment.config.host.io}/api/user/detail`).toPromise()
      .then(res => {
        let data = res.json();
        return this.parseUserDetailInfo(data);
      });
  }

  parseUserDetailInfo(data: any): UserDetailInfoModel {
    let userDetailInfo = new UserDetailInfoModel();

    if (data.uid) userDetailInfo.uid = data.uid;
    if (data.username) userDetailInfo.username = data.username;
    if (data.nick) userDetailInfo.nick = data.nick;
    if (data.intro) userDetailInfo.intro = data.intro;
    if (data.avatar) userDetailInfo.avatar = data.avatar;
    if (data.sex) userDetailInfo.sex = data.sex;

    return userDetailInfo;
  }

  postUserInfo(nick: string, intro: string): Promise<void> {
    const url = `${environment.config.host.io}/api/user/detail`;
    let data: {[key: string]: string} = {
      nick: nick,
      intro: intro,
    };

    return this.http.put(url, data).toPromise().then((res) => {
      // 更新用户信息, 避免缓存数据不一致。
      return this.getUserInfo(true).then(() => {
      return
      });
    });
  }

  verifyUsername(username: string): Promise<void> {
    return this.http.post(`${environment.config.host.io}/api/user/username/verify`, {username: username}).toPromise()
      .then(res => {
        return;
      });
  }
}
